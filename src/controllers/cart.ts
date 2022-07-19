import { Request, Response } from 'express';
import logging from '../config/logging';
import User from '../models/user';

const read = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const user = await User.findById(userId).populate('cart.items.product');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const cart = user.cart;
    return res.status(200).json({ cart });
  } catch (error) {
    logging.error('Error getting product', error);
    return res.status(500).json({
      error,
    });
  }
};

const update = async (req: Request, res: Response) => {
  logging.info('Attempting to update cart');
  try {
    const userId = res.locals.user.id;

    const user = await User.findById(userId);
    if (!user) {
      logging.warn(`Could not find user with id: ${userId}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cart = req.body;
    await user.save();
    await user.populate('cart.items.product');
    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    logging.error('Error updating cart', error);
    return res.status(500).json({
      error,
    });
  }
};

export default { read, update };
