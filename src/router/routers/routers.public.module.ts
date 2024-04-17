import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/app/modules/character/character.module';
import { DevilsModule } from 'src/app/modules/devils/devils.module';
import { EventsModule } from 'src/app/modules/events/event.module';
import { GrimoireModule } from 'src/app/modules/grimoire/grimoire.module';
import { BuisnessModule } from 'src/app/modules/jobs/business/business.module';
import { JudicialSystemModule } from 'src/app/modules/jobs/judicial.system/judicial.system.module';
import { MinesModule } from 'src/app/modules/jobs/mines/mines.module';
import { SquadsModule } from 'src/app/modules/jobs/squards/squads.module';
import { MapModule } from 'src/app/modules/map/map.module';
import { MoneyModule } from 'src/app/modules/money/money.module';
import { RaceModule } from 'src/app/modules/race/race.module';
import { SpiritsModules } from 'src/app/modules/spirits/spirits.module';
import { UserModule } from 'src/app/modules/user/user.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [
        CharacterModule,
        DevilsModule,
        SpiritsModules,
        EventsModule,
        GrimoireModule,
        BuisnessModule,
        JudicialSystemModule,
        MinesModule,
        SquadsModule,
        MapModule,
        MoneyModule,
        RaceModule,
        UserModule,
    ],
})
export class RoutesPublicModule {}
