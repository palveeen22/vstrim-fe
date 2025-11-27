import { BASE_URL_API } from '@env';

export const ENV = {
  API_URL: BASE_URL_API ?? 'http://localhost:3002/api',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
