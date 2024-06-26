import path from 'path';
import { configDotenv } from 'dotenv';

const envFile = process.env['NODE_ENV'] ? `.env.${process.env['NODE_ENV']}` : '.env';

configDotenv({ path: envFile });

const rootPath = __dirname;

const config = {
  rootPath,
  port: parseInt(process.env['PORT'] || '8000'),
  mongoose: {
    db: process.env['MONGO_DB_URL'] || 'mongodb://localhost/tgl',
  },
  publicPath: path.join(rootPath, 'public'),
};

export default config;
