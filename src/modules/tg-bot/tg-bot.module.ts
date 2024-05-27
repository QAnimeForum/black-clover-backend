import { Module } from '@nestjs/common';
import { TgBotService } from './services/tg-bot.service';
import { TgBotUpdate } from './services/tg-bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from '../character/character.module';
import { RaceModule } from '../race/race.module';
import { MapModule } from '../map/map.module';
import { UserModule } from '../user/user.module';
import { DevilsModule } from '../devils/devils.module';
import { GrimoireModule } from '../grimoire/grimoire.module';

import { JudicialSystemModule } from '../judicial.system/judicial.system.module';
import { APP_GUARD } from '@nestjs/core';
import { TelegrafThrottlerGuard } from './common/guards/TelegrafThrottlerGuard';
import { ThrottlerModule } from '@nestjs/throttler';
import { SpiritsModule } from '../spirits/spirits.module';
import { MinesModule } from '../mines/mines.module';
import { SquadsModule } from '../squards/squads.module';
import { StartScene } from './scenes/start.scene';
import { HomeScene } from './scenes/home.scene';
import { HelpScene } from './scenes/help.scene';
import { AllDevilsScene } from './scenes/devils/all.devils.scene';
import { MyDevilsScene } from './scenes/devils/devils-my.scene';
import { MySpiritsScene } from './scenes/spirits/spirits-my.scene';
import { AllSpiritsScene } from './scenes/spirits/all.spirits';
import { MagicParlamentScene } from './scenes/organizations/magic.parlament.scene';
import { ArmedForcesScene } from './scenes/organizations/armed.forces.scene';
import { CreateScquadWizard } from './scenes/organizations/create.squad.wizard';
import { MinesScene } from './scenes/organizations/mines.wizard';
import { RequestToParlamentWizard } from './scenes/organizations/request.to.parlament.wizard';
import { AvatarEditWizard } from './scenes/profile/background/avatar-edit.wizard';
import { BackgroundScene } from './scenes/profile/background/background.wizard';
import { CharacterHistoryEditWizard } from './scenes/profile/background/history-edit.wizard';
import { CharacterNameEditDto } from '../character/dto/character.name-edit.dto';
import { GrimoreScene } from './scenes/profile/grimoire/grimoire.scene';
import { MagicNameEditWizard } from './scenes/profile/grimoire/magic-name.edit.scene';
import { SpellCreateWizard } from './scenes/profile/grimoire/spell-create.wizard';
import { CharacterCreateWizard } from './scenes/profile/character-create.wizard';
import { InventoryScene } from './scenes/profile/inventory.scene';
import { CharacterParamsScene } from './scenes/profile/params.scene';
import { ProfileScene } from './scenes/profile/profile.scene';
import { WalletScene } from './scenes/profile/wallet.scene';
import {
    AddAdminWizard,
    AdminScene,
    DeleteAdminWizard,
} from './scenes/admin/adminScene';
import { OrganizationsScene } from './scenes/organizations/organization.scene';
import { MapWizard } from './scenes/map/map.wizard';
import { MoneyModule } from '../money/money.module';
import { ItemsModule } from '../items/items.module';
import { EventsModule } from '../events/event.module';
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                limit: 1,
                ttl: 1000,
            },
        ]),
        TypeOrmModule.forFeature([]),
        GrimoireModule,
        EventsModule,
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
        CharacterModule,
    ],
    providers: [
        TgBotUpdate,
        TgBotService,
        //common
        StartScene,

        HomeScene,
        HelpScene,

        //admin
        AdminScene,
        AddAdminWizard,
        DeleteAdminWizard,

        //Devils
        AllDevilsScene,
        MyDevilsScene,
        //Spirits
        AllSpiritsScene,
        MySpiritsScene,
        //Map
        MapWizard,
        //organizartions
        OrganizationsScene,
        MagicParlamentScene,
        RequestToParlamentWizard,
        ArmedForcesScene,
        CreateScquadWizard,
        MinesScene,

        //profile
        CharacterCreateWizard,
        BackgroundScene,
        AvatarEditWizard,

        CharacterHistoryEditWizard,

        CharacterNameEditDto,
        InventoryScene,
        CharacterParamsScene,
        ProfileScene,
        WalletScene,

        //grimoire
        GrimoreScene,
        SpellCreateWizard,
        MagicNameEditWizard,
        {
            provide: APP_GUARD,
            useClass: TelegrafThrottlerGuard,
        },
    ],
})
export class TgBotModule {}
