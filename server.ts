import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import { pupRouter } from './routers/pup';
import usersRouter from './routers/users';
import shipmentsRouter from './routers/shipments';
import warehouseRouter from './routers/warehouses';

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/shipments', shipmentsRouter);
app.use('/pups', pupRouter);
app.use('/warehouse', warehouseRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`server started on ${port} port`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();
