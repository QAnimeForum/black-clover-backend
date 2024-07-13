import { Module, NotFoundException } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { HelperModule } from 'src/common/helper/helper.module';
import { DataSourceOptions, DataSource } from 'typeorm';
import { ENUM_APP_ENVIRONMENT } from './constants/app.enum.constant';
import configs from 'src/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TgBotModule } from '../modules/tg-bot/tg-bot.module';
import { session } from 'telegraf';
import { Postgres } from '@telegraf/session/pg';
import { PostgresAdapter } from 'kysely';
import {
    LOGGER_BOTCHECK,
    LOGGER_ERROR,
    LOGGER_EXCEPTION,
    LOGGER_INFO,
    winstonOptions,
} from 'src/modules/tg-bot/utils/logger';
import { WinstonModule } from 'nest-winston';
import { existsSync, mkdirSync } from 'fs';
import { ErrorModule } from 'src/common/error/error.module';
import { MessageModule } from 'src/common/message/message.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { RequestModule } from 'src/common/request/request.module';
import { ResponseModule } from 'src/common/response/response.module';
import { CharacterModule } from 'src/modules/character/character.module';
import { DevilsModule } from 'src/modules/devils/devils.module';
import { GrimoireModule } from 'src/modules/grimoire/grimoire.module';
import { ItemsModule } from 'src/modules/items/items.module';
import { JudicialSystemModule } from 'src/modules/judicial.system/judicial.system.module';
import { MapModule } from 'src/modules/map/map.module';
import { MinesModule } from 'src/modules/mines/mines.module';
import { MoneyModule } from 'src/modules/money/money.module';
import { RaceModule } from 'src/modules/race/race.module';
import { SpiritsModule } from 'src/modules/spirits/spirits.module';
import { SquadsModule } from 'src/modules/squards/squads.module';
import { UserModule } from 'src/modules/user/user.module';
import { AnnouncementModule } from 'src/modules/events/event.module';
import { PlantService } from 'src/modules/plants/services/plant.service';
import { PlantsModule } from 'src/modules/plants/plants.module';
import { CuisineModule } from 'src/modules/cuisine/cuisine.module';

const logDir = 'logs/service/';
const infoLogDir = `${logDir}${LOGGER_INFO}`;
const errorLogDir = `${logDir}${LOGGER_ERROR}`;
const botCheckLogDir = `${logDir}${LOGGER_BOTCHECK}`;
const exceptionLogDir = `${logDir}${LOGGER_EXCEPTION}`;

if (!existsSync(infoLogDir)) mkdirSync(infoLogDir);
if (!existsSync(errorLogDir)) mkdirSync(errorLogDir);
if (!existsSync(botCheckLogDir)) mkdirSync(botCheckLogDir);
if (!existsSync(exceptionLogDir)) mkdirSync(exceptionLogDir);

@Module({
    controllers: [AppController],
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
                SUPER_ADMIN_ID: Joi.string().required(),
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
                    .default('postgresql://localhost:6432')
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
                TELEGRAM_BOT_TOKEN: Joi.string().required(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        WinstonModule.forRoot(winstonOptions),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
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
        PlantsModule,
        GrimoireModule,
        AnnouncementModule,
        DevilsModule,
        SpiritsModule,
        ItemsModule,
        MapModule,
        RaceModule,
        MoneyModule,
        JudicialSystemModule,
        MinesModule,
        SquadsModule,
        MapModule,
        MoneyModule,
        RaceModule,
        UserModule,
        CuisineModule,
        CharacterModule,
        TelegrafModule.forRootAsync({
            imports: [TgBotModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                token: process.env.TELEGRAM_BOT_TOKEN,
                middlewares: [session({ store: store(config) })],
            }),
        }),
    ],
})
export class AppModule {}

const store = (config: ConfigService) => {
    return Postgres<PostgresAdapter>({
        database: config.get<string>('DATABASE_NAME'),
        host: config.get<string>('DATABASE_HOST'),
        user: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        onInitError(err) {
            throw new NotFoundException(`Config value in not found`, err);
        },
    });
};
