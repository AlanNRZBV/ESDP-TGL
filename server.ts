import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routers/users';
import shipmentsRouter from './routers/shipments';
import warehousesRouter from './routers/warehouses';
import { pricesRouter } from './routers/prices';
import pupsRouter from './routers/pups';
import regionsRouter from './routers/regions';
import companyAddressesRouter from './routers/companyAddresses';
import socialsRouter from './routers/socials';
import priceListsRouter from './routers/priceLists';
import bannedCategoriesRouter from './routers/bannedCategoriesRouter';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);
app.use('/shipments', shipmentsRouter);
app.use('/pups', pupsRouter);
app.use('/warehouse', warehousesRouter);
app.use('/price', pricesRouter);
app.use('/regions', regionsRouter);
app.use('/company-addresses', companyAddressesRouter);
app.use('/socials', socialsRouter);
app.use('/price-lists', priceListsRouter);
app.use('/banned-categories', bannedCategoriesRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(config.port, () => {
    console.log(`server started on ${config.port} port`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();
