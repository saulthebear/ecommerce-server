import logging from '../config/logging';
import firebaseAdmin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

const extractFirebaseInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info('Validating Firebase token');

  // Remove Bearer from token
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logging.warn('No token provided');
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  firebaseAdmin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if (decodedToken) {
        logging.info('Token verified');
        res.locals.firebase = decodedToken;
        res.locals.fire_token = token;
        next();
      } else {
        logging.warn('Token invalid - unauthorized');
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(401).send({
        message: 'Unauthorized',
      });
    });
};

export default extractFirebaseInfo;