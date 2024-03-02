export const databaseTypes = [
  'mysql',
  'postgres',
  'cockroachdb',
  'sap',
  'spanner',
  'mariadb',
  'sqlite',
  'cordova',
  'react-native',
  'nativescript',
  'sqljs',
  'oracle',
  'mssql',
  'mongodb',
  'aurora-mysql',
  'aurora-postgres',
  'expo',
  'better-sqlite3',
  'capacitor',
] as const;
type DatabaseType = (typeof databaseTypes)[number];

export type DatabaseConfig = {
  url?: string;
  type?: DatabaseType;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};
