import { Module } from '@nestjs/common';
//import { JobsModule } from 'src/jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { HelperModule } from 'src/common/helper/helper.module';
import { DataSourceOptions, DataSource } from 'typeorm';
import { ENUM_APP_ENVIRONMENT } from './constants/app.enum.constant';
import configs from 'src/config';
import { AppMiddlewareModule } from './middleware/app.middleware.module';
import { RouterModule } from 'src/router/router.module';
//import { AppMiddlewareModule } from 'src/app/middleware/app.middleware.module';
@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationSchema: Joi.object({
                APP_NAME: Joi.string().required(),
                APP_ENV: Joi.string()
                    .valid(...Object.values(ENUM_APP_ENVIRONMENT))
                    .default('development')
                    .required(),
                APP_TZ: Joi.string().required(),
                APP_MAINTENANCE: Joi.boolean().default(false).required(),

                HTTP_ENABLE: Joi.boolean().default(true).required(),
                HTTP_HOST: [
                    Joi.string().ip({ version: 'ipv4' }).required(),
                    Joi.valid('localhost').required(),
                ],
                HTTP_PORT: Joi.number().default(3000).required(),
                HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
                HTTP_VERSION: Joi.number().required(),

                DEBUGGER_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),

                JOB_ENABLE: Joi.boolean().default(false).required(),

                DATABASE_URL: Joi.string()
                    .default('postgresql://localhost:5432')
                    .required(),
                DATABASE_TYPE: Joi.string().default('postgres').required(),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_SYNCHRONIZ: Joi.string().required(),
                DATABASE_MAX_CONNECTIONS: Joi.number().required(),
                DATABASE_SSL_ENABLED: Joi.bool().required(),
                DATABASE_REJECT_UNAUTHORIZED: Joi.bool().required(),
                /**
        *          DATABASE_HOST: Joi.string()
                    .default('mongodb://localhost:27017')
                    .required(),
                DATABASE_NAME: Joi.string().default('ack').required(),
                DATABASE_USER: Joi.string().allow(null, '').optional(),
                DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
                DATABASE_DEBUG: Joi.boolean().default(false).required(),
                DATABASE_OPTIONS: Joi.string().allow(null, '').optional(),
                
        */
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // Use useFactory, useClass, or useExisting
            // to configure the DataSourceOptions.
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get('database.url', { infer: true }),
                host: configService.get('database.host', { infer: true }),
                port: configService.get('database.port', { infer: true }),
                username: configService.get('database.username', {
                    infer: true,
                }),
                password: configService.get('database.password', {
                    infer: true,
                }),
                database: configService.get('database.name', { infer: true }),
                synchronize: configService.get('database.synchronize', {
                    infer: true,
                }),
                dropSchema: false,
                keepConnectionAlive: true,
                logging:
                    configService.get('app.nodeEnv', { infer: true }) !==
                    'production',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                cli: {
                    entitiesDir: 'src',
                    migrationsDir: 'src/database/migrations',
                    subscribersDir: 'subscriber',
                },
                extra: {
                    // based on https://node-postgres.com/apis/pool
                    // max connection pool size
                    max: configService.get('database.maxConnections', {
                        infer: true,
                    }),
                },
            }),

            dataSourceFactory: async (options: DataSourceOptions) => {
                return new DataSource(options).initialize();
            },
        }),
        CommonModule,
        AppMiddlewareModule,

        // Jobs
        //   JobsModule.forRoot(),

        // Routes
        RouterModule.forRoot(),
        HelperModule,
        // Jobs
        ///    JobsModule.forRoot(),

        // Routes
        //  InventoryModule,
        //   RouterModule.forRoot(),
    ],
})
export class AppModule {}
