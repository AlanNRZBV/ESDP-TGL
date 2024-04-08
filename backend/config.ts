import path from 'path';
import {configDotenv} from 'dotenv';

configDotenv();

const rootPath = __dirname;

const config = {
    rootPath,
   mongoose: {
     db: 'mongodb://localhost/tgl',
   },
  publicPath: path.join(rootPath, 'public'),
};

export default config;