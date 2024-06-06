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
import { BackgroundScene } from './scenes/profile/background/background.scene';
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
import { OrganizationsScene } from './scenes/organizations/organization.scene';
import { MapWizard } from './scenes/map/map.wizard';
import { MoneyModule } from '../money/money.module';
import { ItemsModule } from '../items/items.module';
import { AnnouncementModule } from '../events/event.module';
import { CharacterNameEditWizard } from './scenes/profile/background/name-edit.wizard';
import { AppearanceEditWizard } from './scenes/profile/background/appearance-edit.wizard';
import { GoalsEditWizard } from './scenes/profile/background/goals-edit.wizard';
import { HobbiesEditWizard } from './scenes/profile/background/hobbies-edit.wizard';
import { WeaknessEditWizard } from './scenes/profile/background/weakness-edit.wizard';
import { WorldviewEditWizard } from './scenes/profile/background/worldview-edit.wizard';
import { CharacterTraitsEditWizard } from './scenes/profile/background/character-traits-edit.wizard';
import { IdealsEditWizard } from './scenes/profile/background/ideals-edit.wizard';
import { AnnouncementCreateWizard } from './scenes/admin/announcement.create.wizard';
import {
    AddAdminWizard,
    AdminScene,
    DeleteAdminWizard,
} from './scenes/admin/admin.scene';
import { AdminMoneyScene } from './scenes/admin/money.scene';
import { AdminGrimoireScene } from './scenes/admin/admin.grimoire.scene';
import { AcceptRequestWizard } from './scenes/organizations/accept.request.wizard';
import { CommanderInChiefScene } from './scenes/organizations/comander.in.chief.scene';
import { SquadScene } from './scenes/organizations/squad.scene';
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                limit: 1,
                ttl: 1000,
            },
        ]),
        TypeOrmModule.forFeature([]),
        AnnouncementModule,
        GrimoireModule,
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
        MoneyModule,
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
        AdminGrimoireScene,
        AddAdminWizard,
        DeleteAdminWizard,
        AnnouncementCreateWizard,
        AdminMoneyScene,
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
        AcceptRequestWizard,
        CreateScquadWizard,
        SquadScene,
        CommanderInChiefScene,
        MinesScene,

        //profile
        CharacterCreateWizard,
        BackgroundScene,

        CharacterHistoryEditWizard,

        CharacterNameEditDto,
        InventoryScene,
        CharacterParamsScene,
        ProfileScene,
        WalletScene,

        AppearanceEditWizard,
        AvatarEditWizard,
        GoalsEditWizard,
        CharacterNameEditWizard,
        CharacterHistoryEditWizard,
        HobbiesEditWizard,
        WeaknessEditWizard,
        WorldviewEditWizard,
        CharacterTraitsEditWizard,
        IdealsEditWizard,
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
