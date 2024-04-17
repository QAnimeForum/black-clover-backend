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
import { EditGrimoireMagicColorWizard } from './scenes/profile/grimoire/editMagicColorWizard';
import { CreateSpellWizard } from './scenes/profile/grimoire/characterCreateSpellWizard';
import { ProfileScene } from './scenes/profile/profileScene';
import { WalletScene } from './scenes/profile/walletScene';
import { MyDevilsScene } from './scenes/profile/myDevilsScene';
import { MySpiritsScene } from './scenes/profile/mySpiritsScene';
import { InventoryScene } from './scenes/profile/inventoryScene';
import { BioScene, EditCharactreName } from './scenes/profile/BioScene';
import { CharacterParamsScene } from './scenes/profile/paramsScene';
import {
    AllDevilsByFloorScene,
    AllDevilsByRankScene,
    AllDevilsScene,
} from './scenes/devils/allDevilsScene';
import { AdminScene } from './scenes/admin/adminScene';
import { HelpScene } from './scenes/helpScene';
import { GrimoreScene } from './scenes/profile/grimoire/grimoireScene';
import { SpiritsModules } from '../spirits/spirits.module';
import { ArmedForcesScene } from './scenes/organizations/armedForces';
import { OrganizationsScene } from './scenes/organizations/organizationScene';
import { EntryScene } from './scenes/entryScene';
import { HomeScene } from './scenes/homeScene';
import { MagicParlamentScene } from './scenes/organizations/magicParlament';
import { MinesScene } from './scenes/organizations/minesWizard';
import { MineService } from '../jobs/mines/services/mine.service';
import { MinesModule } from '../jobs/mines/mines.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        CharacterModule,
        GrimoireModule,
        RaceModule,
        MapModule,
        UserModule,
        DevilsModule,
        SpiritsModules,
        MinesModule,
    ],
    providers: [
        AdminScene,
        ArmedForcesScene,
        OrganizationsScene,
        HelpScene,
        AllDevilsScene,
        AllDevilsByFloorScene,
        AllDevilsByRankScene,
        AllSpiritsScene,
        MapWizard,
        HomeScene,
        CharacterParamsScene,
        CreateSpellWizard,
        CreateCharacterWizard,
        GrimoreScene,
        EditGrimoireMagicColorWizard,
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
    ],
})
export class TgBotModule {}
