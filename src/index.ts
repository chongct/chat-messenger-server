import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes';

const app = express();

const PORT = process.env.PORT || 3001;
const whitelistCorsUrls =
  process.env.NODE_ENV === 'development'
    ? [process.env.FRONTEND_URI].concat('http://localhost:3000')
    : [process.env.FRONTEND_URI];

dotenv.config();

app.use(bodyParser.json());
app.use(cors({ origin: whitelistCorsUrls }));
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
