import express from 'express';
import dotenv from 'dotenv';
import { fileLogger } from './utils/fileLogger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  fileLogger.success(`Server is running on port ${port}`);
});