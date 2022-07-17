import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import extractFirebaseInfo from './extractFirebaseInfo';

// Require any logged in user
export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  extractFirebaseInfo(req, res, async () => {
    const user = await User.findOne({ uid: res.locals.firebase.uid });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.locals.user = user;
    next();
  });
};

// Require logged in user to be an admin
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  extractFirebaseInfo(req, res, async () => {
    const user = await User.findOne({ uid: res.locals.firebase.uid });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.locals.user = user;

    next();
  });
};
