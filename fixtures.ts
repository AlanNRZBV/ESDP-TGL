import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Pup from './models/Pup';
import Shipment from './models/Shipment';
const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipped drop...`);
  }
};

const run = async () => {
  try {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users', 'pups'];

    for (const collectionName of collections) {
      await dropCollection(db, collectionName);
    }

    const pups = await Pup.create([
      {
        name: 'Pup№1',
        region: 'Чуйская',
        settlement: 'г.Бишкек',
        address: 'пр.Манаса 44',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№2',
        region: 'Таласская',
        settlement: 'г.Талас',
        address: 'ул. Бердике Баатыра 191',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№3',
        region: 'Иссык-Кульская',
        settlement: 'г.Каракол',
        address: 'ул.Ленина 186/1',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№4',
        region: 'Нарынская',
        settlement: 'г.Нарын',
        address: 'ул.Чаначева 15',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№5',
        region: 'Джалал-Абадская',
        settlement: 'г.Джалал-Абад',
        address: 'ул.Кыргызской Республики 79',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№6',
        region: 'Ошская',
        settlement: 'г.Ош',
        address: 'ул.Гапара Айтиева 45а',
        isChina: false,
        phoneNumber: '996505999774',
      },
      {
        name: 'Pup№7',
        region: 'Баткенская',
        settlement: 'г.Баткен',
        address: 'ул.Раззакова 1',
        isChina: false,
        phoneNumber: '996505999774',
      },
    ]);

    const users = await User.create([
      {
        email: 'test_super-admin@gmail.com',
        password: 'qazxswedc',
        firstName: 'Super-Admin',
        lastName: 'Super-Admin',
        middleName: 'Super-Admin',
        pupID: pups[0],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Таласская',
        token: crypto.randomUUID(),
        role: 'super',
        address: 'Чуйкова 122',
      },
      {
        email: 'test_admin@gmail.com',
        password: 'qazxswedc',
        firstName: 'Admin',
        lastName: 'Admin',
        middleName: 'Admin',
        pupID: pups[0],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Чуйская',
        token: crypto.randomUUID(),
        role: 'admin',
        address: 'Чуйкова 122',
      },
      {
        email: 'test_manager@gmail.com',
        password: 'qazxswedc',
        firstName: 'Manager',
        lastName: 'Manager',
        middleName: 'Manager',
        pupID: pups[1],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Ошская',
        token: crypto.randomUUID(),
        role: 'manager',
        address: 'Чуйкова 122',
      },
      {
        email: 'test_user-1@gmail.com',
        password: 'qazxswedc',
        firstName: 'DefaultUser-1',
        lastName: 'DefaultUser-1',
        middleName: 'DefaultUser-1',
        pupID: pups[2],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Иссык-Кульская',
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
      },
      {
        email: 'test_user-2@gmail.com',
        password: 'qazxswedc',
        firstName: 'DefaultUser-2',
        lastName: 'DefaultUser-2',
        middleName: 'DefaultUser-2',
        pupID: pups[0],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Нарынская',
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
      },
      {
        email: 'test_user-3@gmail.com',
        password: 'qazxswedc',
        firstName: 'DefaultUser-3',
        lastName: 'DefaultUser-3',
        middleName: 'DefaultUser-3',
        pupID: pups[0],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Баткенская',
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
      },
      {
        email: 'test_user-4@gmail.com',
        password: 'qazxswedc',
        firstName: 'DefaultUser-4',
        lastName: 'DefaultUser-4',
        middleName: 'DefaultUser-4',
        pupID: pups[0],
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: 'Баткенская',
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
      },
    ]);

    await Shipment.create([
      {
        user: users[3],
        marketID: users[3].marketId,
        pupID: pups[0],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 1,
        price: 250,
        isPaid: true,
      },
      {
        user: users[1],
        marketID: users[1].marketId,
        pupID: pups[1],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 10,
        price: 200,
        isPaid: true,
      },
      {
        user: users[3],
        marketID: users[3].marketId,
        pupID: pups[2],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 7,
        price: 150,
        isPaid: true,
      },
      {
        user: users[4],
        marketID: users[4].marketId,
        pupID: pups[3],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 7,
        price: 250,
        isPaid: true,
      },
      {
        user: users[0],
        marketID: users[0].marketId,
        pupID: pups[4],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 732,
        price: 100,
        isPaid: true,
      },
      {
        user: users[0],
        marketID: users[0].marketId,
        pupID: pups[5],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 7,
        price: 103,
        isPaid: true,
      },
      {
        user: users[6],
        marketID: users[6].marketId,
        pupID: pups[6],
        status: 'КР_ОТПРАВЛЕНО',
        dimensions: 'test',
        weight: 7,
        price: 503,
        isPaid: true,
      },
    ]);

    await db.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

void run();
