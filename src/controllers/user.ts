import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import User from '../models/user';

const validate = async (req: Request, res: Response, next: NextFunction) => {
  logging.info('Token validated, returning user...');

  const firebase = res.locals.firebase;
  try {
    const user = await User.findOne({ uid: firebase.uid });

    if (!user) {
      return res.status(401).json({
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
const create = async (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to create user');
  try {
    const { uid, name } = req.body;

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      uid,
      name,
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to login or register user');
  try {
    const { uid } = req.body;

    const user = await User.findOne({ uid });

    // User not found, create new user
    if (!user) {
      logging.info(`User not found, creating new user: ${uid}`);
      return create(req, res, next);
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
const read = async (req: Request, res: Response, next: NextFunction) => {
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
const readAll = async (req: Request, res: Response, next: NextFunction) => {
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
