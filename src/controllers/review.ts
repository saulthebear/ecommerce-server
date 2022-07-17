import { Request, Response } from 'express';
import logging from '../config/logging';
import { IReview } from '../interfaces/product';
import Product from '../models/product';

const create = async (req: Request, res: Response) => {
  logging.info('Attempting to create product review');
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      logging.info("Product not found. Can't create review");
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const { rating, comment } = req.body;
    const userId = res.locals.user.id;
    const review: IReview = {
      userId,
      rating,
      comment,
    };

    product.reviews.push(review);
    await product.save();

    logging.info(`New product review created`);
    return res.status(201).json({ product });
  } catch (error) {
    logging.error('Error creating product review', error);
    return res.status(500).json({
      error,
    });
  }
};

const update = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const reviewId = req.params.reviewId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      logging.info("Product not found. Can't update review");
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const review = await product.reviews.id(reviewId);

    if (!review) {
      logging.info("Review not found. Can't update review");
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // Check if user updating review is the owner of the review
    if (review.userId != res.locals.user.id) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;

    const updatedProduct = await product.save();

    return res.status(200).json({ updatedProduct });
  } catch (error) {
    logging.error('Error updating product review', error);
    return res.status(500).json({
      error,
    });
  }
};

const destroy = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const reviewId = req.params.reviewId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      logging.info("Product not found. Can't delete review");
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const review = await product.reviews.id(reviewId);

    if (!review) {
      logging.info("Review not found. Can't delete review");
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // Check if user updating review is the owner of the review
    if (review.userId != res.locals.user.id) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    await review.remove();
    await product.save();
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    logging.error('Error deleting product review', error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  create,
  update,
  destroy,
};
