import mongoose from "mongoose";
import connectToDB from "./config";

import Pup from "./models/Pup";

const dropCollection = async (db: mongoose.Connection, collectionsName: string) => {
    try {
        await db.dropCollection(collectionsName);
    } catch (e) {
        console.log(`Collection ${collectionsName} was missing, skipping drop...`)
    }
}

const run = async () => {
    await mongoose.connect(connectToDB.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users','pup'];

    for (const collectionsName of collections) {
        await dropCollection(db, collectionsName);
    }

    await Pup.create([
        {
            region: 'Чуйская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Таласская',
            settlement: 'г.Талас',
            address: 'ул. Бердике Баатыра 191'
        }, {
            region: 'Иссык-Кульская',
            settlement: 'г.Каракол',
            address: 'ул.Ленина 186/1'
        }, {
            region: 'Нарынская',
            settlement: 'г.Нарын',
            address: 'ул.Чаначева 15'
        }, {
            region: 'Джалал-Абадская',
            settlement: 'г.Джалал-Абад',
            address: 'ул.Кыргызской Республики 79'
        }, {
            region: 'Ошская',
            settlement: 'г.Ош',
            address: 'ул.Гапара Айтиева 45а'
        }, {
            region: 'Баткенская',
            settlement: 'г.Баткен',
            address: 'ул.Раззакова 1'
        },
    ]);

    await db.close();
};

void run();