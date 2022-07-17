import { Request, Response } from 'express';
import logging from '../config/logging';
import Order from '../models/order';

// Create an order
const create = async (req: Request, res: Response) => {
  try {
    const { userId, products, payment } = req.body;
    const order = await Order.create({ userId, products, payment });

    logging.info(`New order created with id: ${order.id}`);
    return res.status(201).json({ order });
  } catch (error) {
    logging.error('Error creating order', error);
    return res.status(500).json({
      error,
    });
  }
};

// Get all orders
const readAll = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    logging.error('Error getting orders', error);
    return res.status(500).json({
      error,
    });
  }
};

// Get one order
const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({ order });
  } catch (error) {
    logging.error('Error getting order', error);
    return res.status(500).json({
      error,
    });
  }
};

// Update an order
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({ updatedOrder });
  } catch (error) {
    logging.error('Error updating order', error);
    return res.status(500).json({
      error,
    });
  }
};

// Delete an order
const destroy = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not fund' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    logging.error('Error deleting order', error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  create,
  readAll,
  read,
  update,
  destroy,
};