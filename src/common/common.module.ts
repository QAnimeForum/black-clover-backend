import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelperModule } from 'src/common/helper/helper.module';
import { ErrorModule } from 'src/common/error/error.module';
import { ResponseModule } from 'src/common/response/response.module';
import { RequestModule } from 'src/common/request/request.module';
import { MessageModule } from 'src/common/message/message.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import Joi from 'joi';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constant';
import configs from 'src/config';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { DebuggerLoggerModule } from 'src/common/debugger/debugger.logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
@Module({
    controllers: [],
    providers: [],
    imports: [
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
                APP_LANGUAGE: Joi.string()
                    .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
                    .default(APP_LANGUAGE)
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
        MessageModule,
        HelperModule,
        PaginationModule,
        ErrorModule,
        ResponseModule,
        RequestModule,
        DebuggerLoggerModule,
    ],
})
export class CommonModule {}
