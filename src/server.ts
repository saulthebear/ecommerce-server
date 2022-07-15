import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './config/serviceAccountKey.json';
import userRoutes from './routes/user';

dotenv.config();

const app: Express = express();
// const PORT = parseInt(process.env.PORT || '8080');
// const isProduction = process.env.NODE_ENV === 'production';

// Connect to Firebase Admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
});

// Connect to MongoDB
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(() => {
    logging.info('Connected to MongoDB');
  })
  .catch((error) => {
    logging.error(error);
  });

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logging.info(
    `METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress}`
  );
  res.on('finish', () => {
    logging.info(
      `METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress} - STATUS: ${res.statusCode}`
    );
  });
  next();
});

// Parse the body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Access Policies
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/users', userRoutes);
app.get('/', (req: Request, res: Response) =>
  res.json({ message: 'Hello World! Express + TypeScript' })
);

// Error Handling
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found');
  // (error as any).status = 404;
  return res.status(404).json({ message: error.message });
  next(error);
});

// Listen for requests
app.listen(config.server.port, () =>
  logging.info(
    `⚡️ [server]: Started at ${config.server.host}:${config.server.port}`
  )
);
