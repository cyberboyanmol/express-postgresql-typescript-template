import dotenv from 'dotenv';
import { devConfig } from './dev.config';
import { productionConfig } from './production.config';
dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

export const getConfig = () => {
  if (process.env.NODE_ENV === 'production') return productionConfig;
  return devConfig;
};
