import mongoose from 'mongoose';
import config from './config';
import User from "./models/User";

const dropCollection = async (
    db: mongoose.Connection,
    collectionName: string,
) => {
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

        const collections = ['users'];

        for (const collectionName of collections) {
            await dropCollection(db, collectionName);
        }

        await User.create([
            {
                email: 'test_admin@gmail.com',
                password: 'qazxswedc',
                firstName: "Admin",
                lastName: "Admin",
                middleName: "Admin",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Чуй",
                token: crypto.randomUUID(),
                role: 'admin',
            },
            {
                email: 'test_manager@gmail.com',
                password: 'qazxswedc',
                firstName: "Manager",
                lastName: "Manager",
                middleName: "Manager",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Джалал-Абад",
                token: crypto.randomUUID(),
                role: 'manager',
            },
            {
                email: 'test_user-1@gmail.com',
                password: 'qazxswedc',
                firstName: "DefaultUser-1",
                lastName: "DefaultUser-1",
                middleName: "DefaultUser-1",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Иссык-Куль",
                token: crypto.randomUUID(),
            },
            {
                email: 'test_user-2@gmail.com',
                password: 'qazxswedc',
                firstName: "DefaultUser-2",
                lastName: "DefaultUser-2",
                middleName: "DefaultUser-2",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Нарын",
                token: crypto.randomUUID(),
            },
            {
                email: 'test_user-3@gmail.com',
                password: 'qazxswedc',
                firstName: "DefaultUser-3",
                lastName: "DefaultUser-3",
                middleName: "DefaultUser-3",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Ош",
                token: crypto.randomUUID(),
            },
            {
                email: 'test_user-4@gmail.com',
                password: 'qazxswedc',
                firstName: "DefaultUser-4",
                lastName: "DefaultUser-4",
                middleName: "DefaultUser-4",
                phoneNumber: 996709888111,
                marketId: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
                region: "Талас",
                token: crypto.randomUUID(),
            },
        ]);

        await db.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

void run();