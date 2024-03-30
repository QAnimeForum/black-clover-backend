import { Module } from '@nestjs/common';
import { BuisnessModule } from 'src/app/modules/business/business.module';
import { CharacterModule } from 'src/app/modules/characters/character.module';
import { DevilsModule } from 'src/app/modules/devils/devils.module';
import { MapModule } from 'src/app/modules/map/map.module';
import { MinesModule } from 'src/app/modules/mines/mines.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [
        CharacterModule,
        MapModule,
        DevilsModule,
        MinesModule,
        BuisnessModule,
    ],
})
export class RoutesPublicModule {}
