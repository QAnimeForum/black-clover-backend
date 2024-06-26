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

import { CreateScquadWizard } from './scenes/organizations/create.squad.wizard';
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
import { AddMoneyWizard, AdminMoneyScene } from './scenes/admin/money.scene';
import { AdminGrimoireScene } from './scenes/admin/admin.grimoire.scene';

import { ShopScene } from './scenes/organizations/shop/shop.scene';
import { BLackMarketScene } from './scenes/organizations/shop/black.market.scene';
import { CasinoScene } from './scenes/organizations/casino.scene';
import { BarScene } from './scenes/organizations/shop/bar.scene';
import { FieldsScene } from './scenes/organizations/fields.scene';
import { ShoppingDistrictScene } from './scenes/organizations/shopping.district.scene';
import { SpellNameEditWizard } from './scenes/profile/grimoire/spell-name-edit.wizard';
import { SpellTypeEditWizard } from './scenes/profile/grimoire/spell-type-edit.wizard';
import { SpellDescriptionEditWizard } from './scenes/profile/grimoire/spell-description-edit.wizard';
import { SpellCostEditWizard } from './scenes/profile/grimoire/spell-cost-edit.wizard';
import { SpellMinimalLevelEditWizard } from './scenes/profile/grimoire/spell-minimal-level-edit.wizard';
import { SpellDurationEditWizard } from './scenes/profile/grimoire/spell-duration-edit.wizard';
import { SpellGoalsEditWizard } from './scenes/profile/grimoire/spell-goals-edit.wizard';
import { SpellCooldownEditWizard } from './scenes/profile/grimoire/spell-cooldown-edit.wizard';
import { SpellChangeStatusWizard } from './scenes/admin/spell-change-status.wizard';
import { PlantsModule } from '../plants/plants.module';
import { PlantsService } from './scenes/admin/plants.scene';
import { PlantCreateScene } from './scenes/admin/plant.create.scene';
import { GrimoireTowerScene } from './scenes/organizations/grimoire.tower.scene';
import { MagicParlamentScene } from './scenes/organizations/parlament/magic.parlament.scene';
import { RequestToParlamentWizard } from './scenes/organizations/parlament/request.to.parlament.wizard';
import { AdminMagicParlamentScene } from './scenes/admin/admin.magic.parlament.scene';
import { AdminArmedForcesScene } from './scenes/admin/admin.armed.forces.scene';
import { MinesScene } from './scenes/organizations/mines.scene';
import { AcceptRequestWizard } from './scenes/organizations/armedForces/accept.request.wizard';
import { ArmedForcesScene } from './scenes/organizations/armedForces/armed.forces.scene';
import {
    CommanderInChiefScene,
    ChangeRankScene,
} from './scenes/organizations/armedForces/comander.in.chief.scene';
import { SquadScene } from './scenes/organizations/armedForces/squad.scene';
import { GrmoireWorkerAddWizard } from './scenes/admin/grimoire-worker-add.scene';
import { GrmoireWorkerRemoveWizard } from './scenes/admin/grimoire-worker-remove.scene';
import { JudicialOfficerAddWizard } from './scenes/admin/judicial-officer-add.scene';
import { JudicialOfficerRemoveWizard } from './scenes/admin/judicial-officer-remove.scene';
import { CreateSolveWizard } from './scenes/organizations/parlament/solve-create.scene';
import { CheckOffersScene } from './scenes/organizations/shop/check-offers.scene';
import { MyOffersScene } from './scenes/organizations/shop/my-offers.scene';
import {
    SearchOfferByCategoryScene,
    SearchOfferByNameScene,
} from './scenes/organizations/shop/search-offer.by-name.scene';
import { MarketService } from '../items/service/market.service';
import { CreateEquipmentItemWizard } from './scenes/organizations/shop/create-equipment.item.wizard';
import { CreateOfferWizard } from './scenes/organizations/shop/create-offer.wizard';
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
        PlantsModule,
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
        RaceModule,
        UserModule,
        CharacterModule,
    ],
    providers: [
        TgBotUpdate,
        TgBotService,
        PlantsService,
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
        AddMoneyWizard,
        PlantCreateScene,
        AdminMagicParlamentScene,
        AdminArmedForcesScene,
        //Devils
        AllDevilsScene,
        MyDevilsScene,
        //Spirits
        AllSpiritsScene,
        MySpiritsScene,
        //Map
        MapWizard,
        //organizartions
        CreateEquipmentItemWizard,
        OrganizationsScene,
        MagicParlamentScene,
        RequestToParlamentWizard,
        JudicialOfficerAddWizard,
        JudicialOfficerRemoveWizard,
        CreateSolveWizard,
        ArmedForcesScene,
        AcceptRequestWizard,
        CreateScquadWizard,
        SquadScene,
        CommanderInChiefScene,
        MinesScene,
        CasinoScene,
        BarScene,
        FieldsScene,
        ChangeRankScene,
        ShoppingDistrictScene,
        GrimoireTowerScene,
        //items
        ShopScene,
        CreateOfferWizard,
        BLackMarketScene,
        SearchOfferByNameScene,
        SearchOfferByCategoryScene,

        CreateSolveWizard,
        MyOffersScene,
        CheckOffersScene,
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
        GrmoireWorkerAddWizard,
        GrmoireWorkerRemoveWizard,
        SpellNameEditWizard,
        SpellDescriptionEditWizard,
        SpellTypeEditWizard,
        SpellCostEditWizard,
        SpellDurationEditWizard,
        SpellGoalsEditWizard,
        SpellMinimalLevelEditWizard,
        SpellCooldownEditWizard,
        SpellChangeStatusWizard,
        {
            provide: APP_GUARD,
            useClass: TelegrafThrottlerGuard,
        },
    ],
})
export class TgBotModule {}
