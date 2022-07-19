import { Request, Response } from 'express';
import logging from '../config/logging';
import Stripe from 'stripe';
import config from '../config/config';
import { ICartItem } from '../interfaces/user';
import Product from '../models/product';
import Order from '../models/order';

const stripe = new Stripe(config.stripe.secret_key, {
  apiVersion: '2020-08-27',
});

const create_checkout_session = async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      items: ICartItem[];
    };

    // Convert sent cart items to product documents
    const products = await Promise.all(
      body.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        return {
          product: product,
          quantity: item.quantity,
        };
      })
    );
    // Convert sent cart items to Stripe items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.title,
              description: item?.product.description,
              images: item.product.image_url ? [item.product.image_url] : [],
            },
            unit_amount: item.product.price,
          },
          quantity: item.quantity,
        };
      });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${config.client.url}/checkout/success`,
      cancel_url: `${config.client.url}/checkout/cancel`,
    });

    // Create order in database, with session id
    const order = new Order({
      userId: res.locals.user.id,
      products: products.map((item) => {
        return {
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        };
      }),
      stripeSessionId: session.id,
    });
    await order.save();

    res.status(200).json({ session });
  } catch (error) {
    logging.error('Error creating checkout session', error);
    return res.status(500).json({
      error,
    });
  }
};

const read_session = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        message: 'Missing session id',
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json({ session });
  } catch (error) {
    logging.error('Error reading checkout session', error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  create_checkout_session,
  read_session,
};
