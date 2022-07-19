import dotenv from 'dotenv';
dotenv.config();

const config = {
  mongo: {
    options: {},
    url: `${process.env.MONGO_DB_CONNECTION_STRING}/ecommerce`,
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY || '',
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },
};

export default config;
