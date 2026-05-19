import express from 'express';
import dotenv from 'dotenv';
import { fileLogger } from './utils/fileLogger';
import sequelize, { createDatabaseIfNotExists } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  await createDatabaseIfNotExists();

  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
    process.exit(1);
  }

  app.listen(port, () => {
    fileLogger.success(`Server is running on port ${port}`);
  });
};

startServer();