import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './routes';

const app = express();

const PORT = process.env.PORT || 3001;

dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
}

app.use('/', routes);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected succesfully!');
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error}`);
  }

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
})();
