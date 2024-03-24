import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/app/modules/characters/character.module';
import { DevilsModule } from 'src/app/modules/devils/devils.module';
import { GrimoireModule } from 'src/app/modules/grimoire/grimoire.module';
import { InventoryModule } from 'src/app/modules/inventory/inventory.module';
import { MapModule } from 'src/app/modules/map/map.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [
        CharacterModule,
        InventoryModule,
        GrimoireModule,
        MapModule,
        DevilsModule,
    ],
})
export class RoutesPublicModule {}
