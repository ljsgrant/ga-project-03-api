import express from 'express';
import cors from 'cors';
import Router from './config/router.js';
import { connectDb } from './db/helpers.js';
import { PORT } from './config/environment.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', Router);

async function startServer() {
  try {
    connectDb();
    console.log('Connected to mongodb 🤖');
    app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
  } catch (err) {
    console.log('Oops, ERROR 🤖', err);
  }
}
startServer();
