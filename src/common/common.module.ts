import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelperModule } from 'src/common/helper/helper.module';
import Joi from 'joi';

import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CharacterModule } from 'src/app/modules/characters/character.module';
import { DevilsModule } from 'src/app/modules/devils/devils.module';
import { GrimoireModule } from 'src/app/modules/grimoire/grimoire.module';
import { MapModule } from 'src/app/modules/map/map.module';
@Module({
    controllers: [],
    providers: [],
    imports: [

    ],
})
export class CommonModule {}
