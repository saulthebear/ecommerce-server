import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './config/serviceAccountKey.json';
import userRoutes from './routes/user';
import cartRoutes from './routes/cart';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import categoryRoutes from './routes/category';
import checkoutRoutes from './routes/checkout';

dotenv.config();

const app: Express = express();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Connect to Firebase Admin
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
  });
} else {
  // Connect to Firebase Admin Emulator
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.GCLOUD_PROJECT = 'ecommerce-ce7c0';
  firebaseAdmin.initializeApp({ projectId: 'ecommerce-ce7c0' });
}

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
    `[START] METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress}`
  );
  res.on('finish', () => {
    logging.info(
      `[FINISH] METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress} - STATUS: ${res.statusCode}`
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
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/checkout', checkoutRoutes);
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
    `?????? Server listening at ${config.server.host}:${config.server.port}`
  )
);
