import { AppConfig } from './app/app.config.type';
import { DatabaseConfig } from './database/database.config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};
