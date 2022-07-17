import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Category from '../models/category';

const create = async (req: Request, res: Response) => {
  logging.info('Attempting to create category');
  try {
    const { title, description } = req.body;

    const category = new Category({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
    });

    await category.save();
    logging.info(`New category created: ${category.title}`);
    return res.status(201).json({ category });
  } catch (error) {
    logging.error('Error creating category', error);
    return res.status(500).json({
      error,
    });
  }
};
const read = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to read category: ${_id}`);
  try {
    const category = await Category.findById(_id);

    if (!category) {
      logging.warn(`Could not find category with id: ${_id}`);
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json({ category });
  } catch (error) {
    logging.error('Error reading category', error);
    return res.status(500).json({
      error,
    });
  }
};
const readAll = async (req: Request, res: Response) => {
  logging.info(`Attempting to read categories`);
  try {
    const categories = await Category.find({});

    return res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    logging.error('Error reading categories', error);
    return res.status(500).json({
      error,
    });
  }
};
const update = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to update category: ${_id}`);
  try {
    const category = await Category.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    if (!category) {
      logging.warn(`Could not find category with id: ${_id}`);
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json({ category });
  } catch (error) {
    logging.error('Error updating category', error);
    return res.status(500).json({
      error,
    });
  }
};
const destroy = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to delete category: ${_id}`);
  try {
    const category = await Category.findByIdAndDelete(_id);

    if (!category) {
      logging.warn(`Could not find category with id: ${_id}`);
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json({ category });
  } catch (error) {
    logging.error('Error deleting category', error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  create,
  read,
  readAll,
  update,
  destroy,
};
