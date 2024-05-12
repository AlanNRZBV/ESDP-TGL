import Price from './models/Price';
import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Pup from './models/Pup';
import Shipment from './models/Shipment';
import Warehouse from './models/Warehouse';
import Region from './models/Region';
import CompanyAddress from './models/CompanyAddress';
import Social from './models/Social';
import PriceList from './models/PriceList';

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


    const collections = [
      'users',
      'pups',
      'warehouses',
      'prices',
      'regions',
      'shipments',
      'price-lists',
      'socials',
    ];

    for (const collectionName of collections) {
      await dropCollection(db, collectionName);
    }

    await Warehouse.create({
      name: '特米TECH',
      address: '广东省佛山市南海区里水镇得胜村横五路5号103仓-AFZUV—',
      phoneNumber: '17324524246',
    });

    const regions = await Region.create([
      {
        name: 'Чуйская',
        lang: 'ru',
      },
      {
        name: 'Таласская',
        lang: 'ru',
      },
      {
        name: 'Иссык-Кульская',
        lang: 'ru',
      },
      {
        name: 'Нарынская',
        lang: 'ru',
      },
      {
        name: 'Джалал-Абадская',
        lang: 'ru',
      },
      {
        name: 'Ошская',
        lang: 'ru',
      },
      {
        name: 'Баткенская',
        lang: 'ru',
      },
    ]);

    const pups = await Pup.create([
      {
        name: 'ПВЗ№1',
        region: regions[0]._id,
        settlement: 'г.Бишкек',
        address: 'пр.Манаса 44',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№2',
        region: regions[1]._id,
        settlement: 'г.Талас',
        address: 'ул. Бердике Баатыра 191',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№3',
        region: regions[2]._id,
        settlement: 'г.Каракол',
        address: 'ул.Ленина 186/1',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№4',
        region: regions[3]._id,
        settlement: 'г.Нарын',
        address: 'ул.Чаначева 15',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№5',
        region: regions[4]._id,
        settlement: 'г.Джалал-Абад',
        address: 'ул.Кыргызской Республики 79',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№6',
        region: regions[5]._id,
        settlement: 'г.Ош',
        address: 'ул.Гапара Айтиева 45а',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№7',
        region: regions[6]._id,
        settlement: 'г.Баткен',
        address: 'ул.Раззакова 1',
        phoneNumber: '996505999774',
      },
    ]);

    const users = await User.create([
      {
        email: 'super@gmail.com',
        password: 'qwerty',
        firstName: 'Admin',
        lastName: 'Super',
        middleName: 'Superadminovich',
        pupID: pups[0]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[0]._id,
        token: crypto.randomUUID(),
        role: 'super',
        address: 'Чуйкова 122',
        settlement: 'Бишкек',
      },
      {
        email: 'admin@gmail.com',
        password: 'qwerty',
        firstName: 'Admin',
        lastName: 'Adminov',
        middleName: 'Adminovich',
        pupID: pups[0]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[1]._id,
        token: crypto.randomUUID(),
        role: 'admin',
        address: 'Чуйкова 122',
        settlement: 'Нарын',
      },
      {
        email: 'manager@gmail.com',
        password: 'qwerty',
        firstName: 'Manager',
        lastName: 'Managerov',
        middleName: 'Managerovich',
        pupID: pups[1]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[2]._id,
        token: crypto.randomUUID(),
        role: 'manager',
        address: 'Чуйкова 122',
        settlement: 'Нарын',
      },
      {
        email: 'user1@gmail.com',
        password: 'qwerty',
        firstName: 'User1',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pups[2]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[3]._id,
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
        settlement: 'Талас',
      },
      {
        email: 'user2@gmail.com',
        password: 'qwerty',
        firstName: 'User2',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pups[0]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[4]._id,
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
        settlement: 'Бишкек',
      },
      {
        email: 'user3@gmail.com',
        password: 'qwerty',
        firstName: 'User3',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pups[0]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[5]._id,
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
        settlement: 'Нарын',
      },
      {
        email: 'user4@gmail.com',
        password: 'qwerty',
        firstName: 'User4',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pups[0]._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: regions[6]._id,
        token: crypto.randomUUID(),
        address: 'Чуйкова 122',
        settlement: 'Ош',
      },
    ]);

    await Shipment.create([
      {
        userId: users[3]._id,
        pupId: pups[0],
        userMarketId: users[3].marketId,
        status: 'КНР_ПРИБЫЛО',
        trackerNumber: 123456789,
        dimensions: {
          height: 1000,
          width: 1000,
          length: 1000,
        },
        weight: 123,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
      {
        userId: users[3]._id,
        pupId: pups[0],
        userMarketId: users[3].marketId,
        status: 'КНР_ПРИБЫЛО',
        trackerNumber: 123456789,
        dimensions: {
          height: 1000,
          width: 1000,
          length: 1000,
        },
        weight: 123,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
      {
        userId: users[4]._id,
        pupId: pups[1],
        userMarketId: users[4].marketId,
        status: 'КНР_ОТПРАВЛЕНО',
        trackerNumber: 123456788,
        dimensions: {
          height: 1020,
          width: 1030,
          length: 100,
        },
        weight: 13,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
      {
        userId: users[5]._id,
        userMarketId: users[5].marketId,
        status: 'КР_ПРИБЫЛО',
        trackerNumber: 123456787,
        pupId: pups[0]._id,
        dimensions: {
          height: 1020,
          width: 1030,
          length: 100,
        },
        weight: 13,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
      {
        userId: users[5]._id,
        userMarketId: users[5].marketId,
        status: 'КР_ОТПРАВЛЕНО',
        trackerNumber: 123456786,
        pupId: pups[2]._id,
        dimensions: {
          height: 1020,
          width: 1030,
          length: 100,
        },
        weight: 13,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
      {
        userId: users[6]._id,
        userMarketId: users[6].marketId,
        pupId: pups[4]._id,
        status: 'ЗАВЕРШЕН',
        trackerNumber: 123456785,
        dimensions: {
          height: 1020,
          width: 1030,
          length: 100,
        },
        weight: 13,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: true,
        datetime: Date.now(),
      },
      {
        userId: users[6]._id,
        userMarketId: users[6].marketId,
        status: 'ОТКАЗ',
        trackerNumber: 123456784,
        pupId: pups[5]._id,
        dimensions: {
          height: 1020,
          width: 1030,
          length: 100,
        },
        weight: 13,
        price: {
          usd: 100,
          som: 10000,
        },
        isPaid: false,
        datetime: Date.now(),
      },
    ]);
    await Price.create([
      {
        exchangeRate: 88,
        deliveryPrice: 5,
      },
    ]);

    await CompanyAddress.create({
      address: 'Test address string',
      city: 'Bishkek',
      district: 'Test district',
      postCode: '720000',
    });

    await Social.create([
      {
        name: 'Instagram',
        link: 'https://www.instagram.com/cargo.878_kg',
        image: 'fixtures/images/inst.png',
      },
      {
        name: 'WhatsApp',
        link: 'https://wa.me/996222601960?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5',
        image: 'fixtures/images/whatsapp.png',
      },
      {
        name: 'TikTok',
        link: 'https://www.tiktok.com/@techgear.logistics',
        image: 'fixtures/images/tt.png',
      },
    ]);

    await PriceList.create([
      {
        name: 'Хозтовары',
        ranges: [
          {
            range: '0-80',
            value: 3.7,
          },
          {
            range: '110-120',
            value: 3.6,
          },
          {
            range: '120-130',
            value: 3.5,
          },
          {
            range: '130-140',
            value: 3.4,
          },
          {
            range: '140-150',
            value: 3.3,
          },
          {
            range: '150-160',
            value: 3.2,
          },
          {
            range: '160-170',
            value: 3.1,
          },
          {
            range: '170-180',
            value: 3,
          },
          {
            range: '180-190',
            value: 2.9,
          },
          {
            range: '190-200',
            value: 2.8,
          },
          {
            range: '200-250',
            value: 2.7,
          },
          {
            range: '250-300',
            value: 2.6,
          },
          {
            range: '300-350',
            value: 2.5,
          },
          {
            range: '350-400',
            value: 2.4,
          },
          {
            range: '400-500',
            value: 2.3,
          },
          {
            range: '500-600',
            value: 2.3,
          },
          {
            range: '600-800',
            value: 2.2,
          },
          {
            range: '800-1000',
            value: 2.1,
          },
          {
            range: '1000-9999',
            value: 2,
          },
        ],
      },
      {
        name: 'Одежда',
        ranges: [
          {
            range: '0-80',
            value: 4,
          },
          {
            range: '110-120',
            value: 4.7,
          },
          {
            range: '120-130',
            value: 4.6,
          },
          {
            range: '130-140',
            value: 4.5,
          },
          {
            range: '140-150',
            value: 4.4,
          },
          {
            range: '150-160',
            value: 4.3,
          },
          {
            range: '160-170',
            value: 4.2,
          },
          {
            range: '170-180',
            value: 4.1,
          },
          {
            range: '180-190',
            value: 4,
          },
          {
            range: '190-200',
            value: 3.9,
          },
          {
            range: '200-250',
            value: 3.8,
          },
          {
            range: '250-300',
            value: 3.7,
          },
          {
            range: '300-350',
            value: 4,
          },
          {
            range: '350-400',
            value: 4.1,
          },
          {
            range: '400-5000',
            value: 4.2,
          },
        ],
      },
    ]);

    await db.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

void run();
