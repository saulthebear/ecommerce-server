import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Product from '../models/product';

const create = async (req: Request, res: Response) => {
  logging.info('Attempting to create product');
  try {
    const { title, price, description, image_url, category } = req.body;

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      title,
      price,
      description,
      image_url,
      category,
    });

    await product.save();
    logging.info(`New product created: ${product.title}`);
    return res.status(201).json({ product });
  } catch (error) {
    logging.error('Error creating product', error);
    return res.status(500).json({
      error,
    });
  }
};

const read = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to read product: ${_id}`);
  try {
    const product = await Product.findById(_id);

    if (!product) {
      logging.warn(`Could not find product with id: ${_id}`);
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    logging.error('Error reading product', error);
    return res.status(500).json({
      error,
    });
  }
};

const readAll = async (req: Request, res: Response) => {
  logging.info(`Attempting to read products`);
  try {
    const products = await Product.find({});

    return res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    logging.error('Error reading products', error);
    return res.status(500).json({
      error,
    });
  }
};

const update = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to update product: ${_id}`);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return res.status(200).json({ updatedProduct });
  } catch (error) {
    logging.error('Error updating product', error);
    return res.status(500).json({
      error,
    });
  }
};

const destroy = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to delete product: ${_id}`);
  try {
    await Product.findByIdAndDelete(_id);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logging.error('Error deleting product', error);
    return res.status(500).json({
      error,
    });
  }
};

const readByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  logging.info(`Attempting to read products by category: ${categoryId}`);
  try {
    const products = await Product.find({ category: categoryId });
    return res.status(200).json({ count: products.length, products });
  } catch (error) {
    logging.error('Error reading products by category', error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  create,
  read,
  readAll,
  readByCategory,
  update,
  destroy,
};
