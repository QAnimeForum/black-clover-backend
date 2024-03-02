import { registerAs } from '@nestjs/config';
import { DatabaseConfig, databaseTypes } from './database.config.type';
import { EnvironmentVariablesValidator } from './environment.variables.validator';
import validateConfig from 'src/config/validate-config';

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  let type = databaseTypes.find(
    (validName: string) => validName === process.env.DATABASE_TYPE,
  );
  if (type === undefined) {
    type = 'postgres';
  }
  return {
    url: process.env.DATABASE_URL,
    type: type,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };
});
