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
};

export default config;
