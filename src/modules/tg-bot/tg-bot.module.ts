import { Module } from '@nestjs/common';
import { TgBotService } from './services/tg-bot.service';
import { TgBotUpdate } from './services/tg-bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapWizard } from './scenes/map/mapWizard';
import { AllSpiritsScene } from './scenes/spirits/allSpirits';
import { CreateCharacterWizard } from './scenes/profile/createCharacterWizard';
import { CharacterModule } from '../character/character.module';
import { RaceModule } from '../race/race.module';
import { MapModule } from '../map/map.module';
import { UserModule } from '../user/user.module';
import { DevilsModule } from '../devils/devils.module';
import { GrimoireModule } from '../grimoire/grimoire.module';
import { EditGrimoireMagicNameWizard } from './scenes/profile/grimoire/editGrimoireMagicWizard';

import { CreateSpellWizard } from './scenes/profile/grimoire/characterCreateSpellWizard';
import { ProfileScene } from './scenes/profile/profileScene';
import { WalletScene } from './scenes/profile/walletScene';
import { MyDevilsScene } from './scenes/profile/myDevilsScene';
import { MySpiritsScene } from './scenes/profile/mySpiritsScene';
import { InventoryScene } from './scenes/profile/inventoryScene';
import { BioScene, EditCharactreName } from './scenes/profile/BioScene';
import { CharacterParamsScene } from './scenes/profile/paramsScene';
import {

    AllDevilsScene,
} from './scenes/devils/allDevilsScene';
import {
    AddAdminWizard,
    AdminScene,
    DeleteAdminWizard,
} from './scenes/admin/adminScene';
import { HelpScene } from './scenes/helpScene';
import { GrimoreScene } from './scenes/profile/grimoire/grimoireScene';
import { SpiritsModule } from '../spirits/spirits.module';
import { OrganizationsScene } from './scenes/organizations/organizationScene';
import { EntryScene } from './scenes/entryScene';
import { HomeScene } from './scenes/homeScene';
import {
    MagicParlamentScene,
    RequestToParlamentWizard,
} from './scenes/organizations/magicParlament';
import { MinesScene } from './scenes/organizations/minesWizard';
import { MinesModule } from '../mines/mines.module';
import { SquadsModule } from '../squards/squads.module';
import {
    AcceptRequestWizard,
    ArmedForcesScene,
    RejectrequestWizard,
} from './scenes/organizations/armedForcesScene';
import { JudicialSystemModule } from '../judicial.system/judicial.system.module';
import { APP_GUARD } from '@nestjs/core';
import { TelegrafThrottlerGuard } from './common/guards/TelegrafThrottlerGuard';
import { ThrottlerModule } from '@nestjs/throttler';
import { CreateSquadWizard } from './scenes/organizations/createSquadWizard';
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                limit: 1,
                ttl: 1000,
            },
        ]),
        TypeOrmModule.forFeature([]),
        CharacterModule,
        GrimoireModule,
        RaceModule,
        MapModule,
        UserModule,
        DevilsModule,
        SpiritsModule,
        MinesModule,
        SquadsModule,
        JudicialSystemModule,
    ],
    providers: [
        AcceptRequestWizard,
        RejectrequestWizard,
        AdminScene,
        AddAdminWizard,
        DeleteAdminWizard,
        ArmedForcesScene,
        OrganizationsScene,
        HelpScene,
        AllDevilsScene,
       // AllDevilsByFloorScene,
     //   AllDevilsByRankScene,
        AllSpiritsScene,
        MapWizard,
        HomeScene,
        RequestToParlamentWizard,
        CharacterParamsScene,
        CreateSpellWizard,
        CreateCharacterWizard,
        GrimoreScene,
        EditGrimoireMagicNameWizard,
        InventoryScene,
        BioScene,
        MyDevilsScene,
        MySpiritsScene,
        ProfileScene,
        WalletScene,
        MinesScene,
        EntryScene,
        TgBotUpdate,
        TgBotService,
        EditCharactreName,
        MagicParlamentScene,
        CreateSquadWizard,
        {
            provide: APP_GUARD,
            useClass: TelegrafThrottlerGuard,
        },
    ],
})
export class TgBotModule {}
