import { Request, Response } from 'express';
import logging from '../config/logging';
import { UserRoles } from '../interfaces/user';
import Order from '../models/order';
import { getSession } from './checkout';

// Create an order
// const create = async (req: Request, res: Response) => {
//   try {
//     const { products, payment } = req.body;
//     const userId = res.locals.user.id;
//     const order = await Order.create({ userId, products, payment });

//     logging.info(`New order created with id: ${order.id}`);
//     return res.status(201).json({ order });
//   } catch (error) {
//     logging.error('Error creating order', error);
//     return res.status(500).json({
//       error,
//     });
//   }
// };

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

const readUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Require admin or order owner
    const userIsAdmin = res.locals.user.role === UserRoles.ADMIN;
    if (userId != res.locals.user.id && !userIsAdmin) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const orders = await Order.find({ userId }).populate('products.product');
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

    const order = await Order.findById(id).populate('products.product');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Require admin or order owner
    const userIsAdmin = res.locals.user.role === UserRoles.ADMIN;
    if (order.userId != res.locals.user.id && !userIsAdmin) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    // Get stripe session
    const session = await getSession(order.stripeSessionId);

    res.status(200).json({ order, session });
  } catch (error) {
    logging.error('Error getting order', error);
    return res.status(500).json({
      error,
    });
  }
};

// Update an order
// const update = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;

//     // const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
//     //   new: true,
//     // });

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         message: 'Order not found',
//       });
//     }

//     // Require admin or order owner
//     const userIsAdmin = res.locals.user.role === UserRoles.ADMIN;
//     if (order.userId != res.locals.user.id && !userIsAdmin) {
//       return res.status(401).json({
//         message: 'Unauthorized',
//       });
//     }

//     order.products = req.body.products;
//     order.payment = req.body.payment;
//     await order.save();

//     res.status(200).json({ order });
//   } catch (error) {
//     logging.error('Error updating order', error);
//     return res.status(500).json({
//       error,
//     });
//   }
// };

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
  // create,
  readAll,
  read,
  // update,
  destroy,
  readUserOrders,
};
