import path from 'path';

const rootPath = __dirname;

const config = {
    rootPath,
   mongoose: {
     db: 'mongodb://localhost/tgl',
   },
  publicPath: path.join(rootPath, 'public'),
};

export default config;