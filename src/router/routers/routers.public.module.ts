import { Module } from '@nestjs/common';
import { CharacterModule } from '../../modules/character/character.module';
import { DevilsModule } from '../../modules/devils/devils.module';
import { EventsModule } from '../../modules/events/event.module';
import { GrimoireModule } from '../../modules/grimoire/grimoire.module';
import { JudicialSystemModule } from '../../modules/judicial.system/judicial.system.module';
import { MinesModule } from '../../modules/mines/mines.module';
import { SquadsModule } from '../../modules/squards/squads.module';
import { MapModule } from '../../modules/map/map.module';
import { MoneyModule } from '../../modules/money/money.module';
import { RaceModule } from '../../modules/race/race.module';
import { SpiritsModule } from '../../modules/spirits/spirits.module';
import { UserModule } from '../../modules/user/user.module';
import { ItemsModule } from 'src/modules/items/items.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [],
})
export class RoutesPublicModule {}
