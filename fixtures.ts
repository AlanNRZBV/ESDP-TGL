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
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Иссык-Кульская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Нарынская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Джалал-Абадская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Ошская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        }, {
            region: 'Баткенская',
            settlement: 'г.Бишкек',
            address: 'пр.Манаса 44'
        },
    ]);

    await db.close();
};

void run();