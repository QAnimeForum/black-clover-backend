import { Module } from '@nestjs/common';
import { TgBotService } from './services/tg-bot.service';
import { TgBotUpdate } from './services/tg-bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgBotI18nService } from './services/tg-bot-i18n.service';
import { EntryWizard } from './scenes/entryWizard';
import { MapWizard } from './scenes/map/mapWizard';
import { AllSpiritsScene } from './scenes/spirits/allSpirits';
import { MinesWizard } from './scenes/work/minesWizard';
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
import { HomeScene } from './scenes/HomeScene';
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
import { ArmedForcesScene } from './scenes/armedForces';
import { GrimoreScene } from './scenes/profile/grimoire/grimoireScene';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        CharacterModule,
        GrimoireModule,
        RaceModule,
        MapModule,
        UserModule,
        DevilsModule,
    ],
    providers: [
        AdminScene,
        ArmedForcesScene,
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
        MinesWizard,
        EntryWizard,
        TgBotUpdate,
        TgBotService,
        TgBotI18nService,
        EditCharactreName,
    ],
    exports: [TgBotI18nService],
})
export class TgBotModule {}
