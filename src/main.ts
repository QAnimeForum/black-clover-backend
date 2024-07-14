import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import swaggerInit from './swagger';
import fs from 'fs';
async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const databaseUri: string = configService.get<string>('database.host');
    const env: string = configService.get<string>('app.env');
    const tz: string = configService.get<string>('app.tz');
    const host: string = configService.get<string>('app.http.host');
    const port: number = configService.get<number>('app.http.port');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');
    const versioningPrefix: string = configService.get<string>(
        'app.versioning.prefix'
    );
    const version: string = configService.get<string>('app.versioning.version');

    // enable
    const httpEnable: boolean = configService.get<boolean>('app.http.enable');
    const versionEnable: string = configService.get<string>(
        'app.versioning.enable'
    );
    const jobEnable: boolean = configService.get<boolean>('app.jobEnable');

    const logger = new Logger();
    process.env.NODE_ENV = env;
    process.env.TZ = tz;

    // Global
    app.setGlobalPrefix(globalPrefix);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Versioning
    if (versionEnable) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: version,
            prefix: versioningPrefix,
        });
    }

    // Swagger
    await swaggerInit(app);

    
    // Listen
  //  await app.listen(port, host);
  await app.listen(port);
    logger.log(`==========================================================`);

    logger.log(`Environment Variable`, 'Black clover application');
    logger.log(
        JSON.parse(JSON.stringify(process.env)),
        'Black clover Application'
    );

    logger.log(`==========================================================`);

    logger.log(`Job is ${jobEnable}`, 'black clover application');
    logger.log(
        `Http is ${httpEnable}, ${
            httpEnable ? 'routes registered' : 'no routes registered'
        }`,
        'Black clover Application'
    );
    logger.log(
        `Http versioning is ${versionEnable}`,
        'Black clover Application'
    );

    logger.log(
        `Http Server running on ${await app.getUrl()}`,
        'Black clover Application'
    );
    logger.log(`Database uri ${databaseUri}`, 'Black clover Application');

    logger.log(`==========================================================`);
}
bootstrap();
