import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import InitSeeder from './seeds/InitSeeder';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    seeds: [InitSeeder],
    autoLoadEntities: true,
    synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(
    config as DataSourceOptions & SeederOptions
);
