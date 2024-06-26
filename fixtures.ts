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
import BannedCategory from './models/BannedCategory';

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
      'pricelists',
      'socials',
      'companyaddresses',
      'bannedcategories',
    ];

    for (const collectionName of collections) {
      await dropCollection(db, collectionName);
    }

    await Warehouse.create({
      name: '特米TECH',
      address: '广东省佛山市南海区里水镇得胜村横五路5号103仓-AFZUV—',
      phoneNumber: '8617324524246',
    });

    await Region.create([
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

    const chui = await Region.findOne({ name: 'Чуйская' });
    const talas = await Region.findOne({ name: 'Таласская' });
    const ik = await Region.findOne({ name: 'Иссык-Кульская' });
    const naryn = await Region.findOne({ name: 'Нарынская' });
    const ja = await Region.findOne({ name: 'Джалал-Абадская' });
    const osh = await Region.findOne({ name: 'Ошская' });
    const batken = await Region.findOne({ name: 'Баткенская' });

    await Pup.create([
      {
        name: 'ПВЗ№1',
        region: chui?._id,
        settlement: 'г.Кант',
        address: 'ул. Абраимова 52',
        phoneNumber: '996506989774',
      },
      {
        name: 'ПВЗ№2',
        region: chui?._id,
        settlement: 'г.Кара-Балта',
        address: 'ул. Железнодорожная 94',
        phoneNumber: '996501979874',
      },
      {
        name: 'ПВЗ№3',
        region: talas?._id,
        settlement: 'г.Талас',
        address: 'ул.Ленина 186/1',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№4',
        region: talas?._id,
        settlement: 'с.Кызыл-Адыр',
        address: 'ул.Марата Айматова 40',
        phoneNumber: '996222549174',
      },
      {
        name: 'ПВЗ№5',
        region: ik?._id,
        settlement: 'г.Балыкчи',
        address: 'ул.Аманбаева 130/1',
        phoneNumber: '996500112355',
      },
      {
        name: 'ПВЗ№6',
        region: ik?._id,
        settlement: 'г.Чолпон-Ата',
        address: 'ул.Советская 173',
        phoneNumber: '996501939574',
      },
      {
        name: 'ПВЗ№7',
        region: naryn?._id,
        settlement: 'г.Нарын',
        address: 'ул.Ленина 52',
        phoneNumber: '996703939511',
      },
      {
        name: 'ПВЗ№8',
        region: naryn?._id,
        settlement: 'г.Казарман',
        address: 'ул.Жээналиева 36',
        phoneNumber: '996505999774',
      },
      {
        name: 'ПВЗ№9',
        region: ja?._id,
        settlement: 'г.Джалал-абад',
        address: 'ул.Тумонбая Байзакова 118',
        phoneNumber: '996222027071',
      },
      {
        name: 'ПВЗ№10',
        region: ja?._id,
        settlement: 'г.Кочкор-Ата',
        address: 'ул.Садовая 79',
        phoneNumber: '996500339774',
      },
      {
        name: 'ПВЗ№11',
        region: osh?._id,
        settlement: 'г.Ош',
        address: 'ул.Ленина 147',
        phoneNumber: '996502571374',
      },
      {
        name: 'ПВЗ№12',
        region: osh?._id,
        settlement: 'г.Кызыл-Кия',
        address: 'ул.Юбилейная 11',
        phoneNumber: '996555314073',
      },
      {
        name: 'ПВЗ№13',
        region: batken?._id,
        settlement: 'г.Баткен',
        address: 'ул.Раззакова 11',
        phoneNumber: '996555315063',
      },
      {
        name: 'ПВЗ№14',
        region: batken?._id,
        settlement: 'с.Пулгон',
        address: 'ул.Жалилова 43',
        phoneNumber: '996222345566',
      },
    ]);

    const pup_chui_1 = await Pup.findOne({ name: 'ПВЗ№1' });
    const pup_chui_2 = await Pup.findOne({ name: 'ПВЗ№2' });
    const pup_talas_1 = await Pup.findOne({ name: 'ПВЗ№3' });
    const pup_talas_2 = await Pup.findOne({ name: 'ПВЗ№4' });
    const pup_ik_1 = await Pup.findOne({ name: 'ПВЗ№5' });
    const pup_ik_2 = await Pup.findOne({ name: 'ПВЗ№6' });
    const pup_naryn_1 = await Pup.findOne({ name: 'ПВЗ№7' });
    const pup_naryn_2 = await Pup.findOne({ name: 'ПВЗ№8' });
    const pup_ja_1 = await Pup.findOne({ name: 'ПВЗ№9' });
    const pup_ja_2 = await Pup.findOne({ name: 'ПВЗ№10' });
    const pup_osh_1 = await Pup.findOne({ name: 'ПВЗ№11' });
    const pup_osh_2 = await Pup.findOne({ name: 'ПВЗ№12' });
    const pup_batken_1 = await Pup.findOne({ name: 'ПВЗ№13' });
    const pup_batken_2 = await Pup.findOne({ name: 'ПВЗ№14' });

    const users = await User.create([
      {
        email: 'super@gmail.com',
        password: 'jSPJJB2X',
        firstName: 'Admin',
        lastName: 'Super',
        middleName: 'Superadminovich',
        pupID: pup_chui_1?._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
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
        pupID: pup_chui_2?._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
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
        pupID: pup_talas_1?._id,
        phoneNumber: '996505999774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
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
        pupID: pup_talas_2?._id,
        phoneNumber: '996500449674',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
        token: crypto.randomUUID(),
        address: 'ул. Гризодубова 50',
        settlement: 'г.Кант',
      },
      {
        email: 'user2@gmail.com',
        password: 'qwerty',
        firstName: 'User2',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_naryn_1?._id,
        phoneNumber: '996501769774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: naryn?._id,
        token: crypto.randomUUID(),
        address: 'ул.восточная 33',
        settlement: 'г. Кант',
      },
      {
        email: 'user3@gmail.com',
        password: 'qwerty',
        firstName: 'User3',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ik_1?._id,
        phoneNumber: '996552918674',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ik?._id,
        token: crypto.randomUUID(),
        address: 'ул. Федорова 105',
        settlement: 'г. Кара-Балта',
      },
      {
        email: 'user4@gmail.com',
        password: 'qwerty',
        firstName: 'User4',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ik_2?._id,
        phoneNumber: '996222998774',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ik?._id,
        token: crypto.randomUUID(),
        address: 'ул. Фурманова 73',
        settlement: 'г. Кара-Балта',
      },
      {
        email: 'user5@gmail.com',
        password: 'qwerty',
        firstName: 'User5',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ja_1?._id,
        phoneNumber: '996500112264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ja?._id,
        token: crypto.randomUUID(),
        address: 'ул. Токтогула 49',
        settlement: 'г. Талас',
      },
      {
        email: 'user6@gmail.com',
        password: 'qwerty',
        firstName: 'User6',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ja_2?._id,
        phoneNumber: '99622030394',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ja?._id,
        token: crypto.randomUUID(),
        address: 'ул. Нуржанова 11',
        settlement: 'г. Талас',
      },
      {
        email: 'user7@gmail.com',
        password: 'qwerty',
        firstName: 'User7',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_osh_1?._id,
        phoneNumber: '996500112264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: osh?._id,
        token: crypto.randomUUID(),
        address: 'ул. Ленина 40',
        settlement: 'г. Кызыл-Адыр',
      },
      {
        email: 'user8@gmail.com',
        password: 'qwerty',
        firstName: 'User8',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_osh_2?._id,
        phoneNumber: '996222030394',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: osh?._id,
        token: crypto.randomUUID(),
        address: 'ул. Марата Айтматова 122',
        settlement: 'г. Кызыл-Адыр',
      },
      {
        email: 'user9@gmail.com',
        password: 'qwerty',
        firstName: 'User9',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_naryn_1?._id,
        phoneNumber: '996501122264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: naryn?._id,
        token: crypto.randomUUID(),
        address: 'ул. Ленина 40',
        settlement: 'г. Балыкчи',
      },
      {
        email: 'user10@gmail.com',
        password: 'qwerty',
        firstName: 'User10',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_naryn_2?._id,
        phoneNumber: '996222040494',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: naryn?._id,
        token: crypto.randomUUID(),
        address: 'ул. Марата Айтматова 122',
        settlement: 'г. Балыкчи',
      },
      {
        email: 'user11@gmail.com',
        password: 'qwerty',
        firstName: 'User11',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_batken_1?._id,
        phoneNumber: '996505112264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: batken?._id,
        token: crypto.randomUUID(),
        address: 'ул. Ленина 40',
        settlement: 'г. Чолпон-Ата',
      },
      {
        email: 'user12@gmail.com',
        password: 'qwerty',
        firstName: 'User12',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_batken_2?._id,
        phoneNumber: '996222050595',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: batken?._id,
        token: crypto.randomUUID(),
        address: 'ул. Марата Айтматова 122',
        settlement: 'г. Чолпон-Ата',
      },
      {
        email: 'user13@gmail.com',
        password: 'qwerty',
        firstName: 'User13',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_chui_1?._id,
        phoneNumber: '996501122264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
        token: crypto.randomUUID(),
        address: 'ул. Ленина 140',
        settlement: 'г. Нарын',
      },
      {
        email: 'user14@gmail.com',
        password: 'qwerty',
        firstName: 'User14',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_chui_2?._id,
        phoneNumber: '996222040494',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
        token: crypto.randomUUID(),
        address: 'ул. Боконбаева 9',
        settlement: 'г. Нарын',
      },
      {
        email: 'user15@gmail.com',
        password: 'qwerty',
        firstName: 'User15',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_talas_1?._id,
        phoneNumber: '996505112264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
        token: crypto.randomUUID(),
        address: 'ул. Кожалиева 21',
        settlement: 'г. Казарман',
      },
      {
        email: 'user16@gmail.com',
        password: 'qwerty',
        firstName: 'User16',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_talas_2?._id,
        phoneNumber: '996222050595',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
        token: crypto.randomUUID(),
        address: 'ул. Тобок 17',
        settlement: 'г. Казарман',
      },
      {
        email: 'user17@gmail.com',
        password: 'qwerty',
        firstName: 'User17',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ja_1?._id,
        phoneNumber: '996555123265',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ja?._id,
        token: crypto.randomUUID(),
        address: 'ул. Тоголок-Молдо 72',
        settlement: 'г. Джалал-Абад',
      },
      {
        email: 'user18@gmail.com',
        password: 'qwerty',
        firstName: 'User18',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_ja_2?._id,
        phoneNumber: '996707000494',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: ja?._id,
        token: crypto.randomUUID(),
        address: 'ул. Шерматова 13',
        settlement: 'г. Джалал-Абад',
      },
      {
        email: 'user19@gmail.com',
        password: 'qwerty',
        firstName: 'User19',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_osh_1?._id,
        phoneNumber: '996500112264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: osh?._id,
        token: crypto.randomUUID(),
        address: 'ул. Транспортная 48',
        settlement: 'г. Кочкор-Ата',
      },
      {
        email: 'user20@gmail.com',
        password: 'qwerty',
        firstName: 'User20',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_osh_2?._id,
        phoneNumber: '996772110465',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: osh?._id,
        token: crypto.randomUUID(),
        address: 'ул. Транспортная 52',
        settlement: 'г. Кочкор-Ата',
      },
      {
        email: 'user21@gmail.com',
        password: 'qwerty',
        firstName: 'User21',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_naryn_1?._id,
        phoneNumber: '996701233365',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: naryn?._id,
        token: crypto.randomUUID(),
        address: 'ул. Пахта-Абадская 50',
        settlement: 'г. Ош',
      },
      {
        email: 'user22@gmail.com',
        password: 'qwerty',
        firstName: 'User22',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_naryn_2?._id,
        phoneNumber: '996707340794',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: naryn?._id,
        token: crypto.randomUUID(),
        address: 'ул. Маяковского 14',
        settlement: 'г. Ош',
      },
      {
        email: 'user23@gmail.com',
        password: 'jSPJJB2X',
        firstName: 'User23',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_batken_1?._id,
        phoneNumber: '996700662264',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: batken?._id,
        token: crypto.randomUUID(),
        address: 'ул. Масалиева 11',
        settlement: 'г. Кызыл-Кия',
      },
      {
        email: 'user24@gmail.com',
        password: 'qwerty',
        firstName: 'User24',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_batken_2?._id,
        phoneNumber: '996700140465',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: batken?._id,
        token: crypto.randomUUID(),
        address: 'ул. Ленина 11',
        settlement: 'г. Кызыл-Кия',
      },
      {
        email: 'user25@gmail.com',
        password: 'qwerty',
        firstName: 'User25',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_chui_1?._id,
        phoneNumber: '996777243365',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
        token: crypto.randomUUID(),
        address: 'ул. Раззакова 13',
        settlement: 'г. Баткен',
      },
      {
        email: 'user26@gmail.com',
        password: 'qwerty',
        firstName: 'User26',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_chui_2?._id,
        phoneNumber: '996777090794',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: chui?._id,
        token: crypto.randomUUID(),
        address: 'ул. Раззакова 50',
        settlement: 'г. Баткен',
      },
      {
        email: 'user27@gmail.com',
        password: 'qwerty',
        firstName: 'User27',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_talas_1?._id,
        phoneNumber: '996772616161',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
        token: crypto.randomUUID(),
        address: 'ул. Жалилова 51',
        settlement: 'с. Пулгон',
      },
      {
        email: 'user28@gmail.com',
        password: 'qwerty',
        firstName: 'User28',
        lastName: 'Userov',
        middleName: 'Userovich',
        pupID: pup_talas_2?._id,
        phoneNumber: '996755578616',
        marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        region: talas?._id,
        token: crypto.randomUUID(),
        address: 'ул. Жалилова 48',
        settlement: 'с. Пулгон',
      },
    ]);

    const defaultUser1 = await User.findOne({ email: 'user1@gmail.com' });

    await Shipment.create([
      {
        userId: users[3]._id,
        pupId: pup_chui_1?._id,
        userMarketId: users[3].marketId,
        status: 'КНР_ПРИБЫЛО',
        trackerNumber: 111111111,
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
        datetime: '2023-06-02T10:23:02Z',
      },
      {
        userId: users[3]._id,
        pupId: pup_chui_1?._id,
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
        pupId: pup_chui_2?._id,
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
        pupId: pup_chui_1?._id,
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
        pupId: pup_talas_1?._id,
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
        pupId: pup_naryn_1?._id,
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
        pupId: pup_naryn_2?._id,
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
        userId: users[1]._id,
        userMarketId: users[1].marketId,
        status: 'ОТКАЗ',
        trackerNumber: 123456782,
        pupId: pup_naryn_1?._id,
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
        userId: defaultUser1?._id,
        trackerNumber: 333,
        dimensions: {
          height: 0,
          width: 0,
          length: 0,
        },
        weight: 1,
        price: {
          usd: 0,
          som: 0,
        },
        isPaid: false,
        isPriceVisible: false,
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

    await BannedCategory.create([
      {
        name: 'Товар 1',
      },
      {
        name: 'Товар 2',
      },
      {
        name: 'Товар 3',
      },
      {
        name: 'Товар 4',
      },
      {
        name: 'Товар 5',
      },
    ]);

    await db.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

void run();
