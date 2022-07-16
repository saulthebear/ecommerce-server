import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import User from '../models/user';
import { ICart } from '../interfaces/user';

const validate = async (req: Request, res: Response) => {
  const firebase = res.locals.firebase;
  try {
    const user = await User.findOne({ uid: firebase.uid });

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    logging.info('Token validated, returning user...');
    return res.status(200).json({ user });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};
const create = async (req: Request, res: Response) => {
  logging.info('Attempting to create user');
  try {
    const { uid, name }: { uid: string; name: string } = req.body;
    const emptyCart: ICart = {
      items: [],
    };

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      uid,
      name,
      cart: emptyCart,
    });

    await user.save();
    logging.info(`New user created: ${user.uid}`);
    return res.status(201).json({ user });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};

const login = async (req: Request, res: Response) => {
  logging.info('Attempting to login or register user');
  logging.info('Request body:', req.body);
  try {
    const { uid } = req.body;

    const user = await User.findOne({ uid });

    // User not found, create new user
    if (!user) {
      logging.info(`User not found, creating new user: ${uid}`);
      return create(req, res);
    }

    // User found, return user
    logging.info(`User found: ${user.uid} - signing in...`);
    return res.status(200).json({ user });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};
const read = async (req: Request, res: Response) => {
  const _id = req.params.id;
  logging.info(`Attempting to read user: ${_id}`);
  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};
const readAll = async (req: Request, res: Response) => {
  logging.info(`Attempting to read all users`);
  try {
    const users = await User.find({});

    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};

export default {
  validate,
  create,
  login,
  read,
  readAll,
};
