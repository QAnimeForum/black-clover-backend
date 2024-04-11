import { Module } from '@nestjs/common';
import { TgBotService } from './services/tg-bot.service';
import { TgBotUpdate } from './services/tg-bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgBotI18nService } from './services/tg-bot-i18n.service';
import { AllDevilsWizard } from './scenes/devils/allDevilsWizard';
import { EntryWizard } from './scenes/entryWizard';
import { MapWizard } from './scenes/map/mapWizard';
import { BioWizard } from './scenes/profile/bioWizard';
import { CharacterParametersWizard } from './scenes/profile/characterParametersWizard';
import { EquipmentWizard } from './scenes/profile/equipmentWizard';
import { GrimoireWizard } from './scenes/profile/grimoireWizard';
import { InventoryWizard } from './scenes/profile/inventoryWizard';
import { MyDevilsWizard } from './scenes/profile/myDevilsWizard';
import { MySpiritsWizard } from './scenes/profile/mySpiritsWIzard';
import { ProfileWizard } from './scenes/profile/profileWizard';
import { WalletWizard } from './scenes/profile/walletWizard';
import { AllSpirtsWizard } from './scenes/spirits/allSpirits';
import { MinesWizard } from './scenes/work/minesWizard';
import { SquadWizard } from './scenes/work/squadWizard';
import { CreateCharacterWizard } from './scenes/profile/createCharacterWizard';
import { CharacterModule } from '../character/character.module';
import { RaceModule } from '../race/race.module';
import { MapModule } from '../map/map.module';
import { UserModule } from '../user/user.module';
import { DevilsModule } from '../devils/devils.module';
import { GrimoireModule } from '../grimoire/grimoire.module';
import { CreateSpellWizard } from './scenes/profile/characterCreateSpellWizard';
import { EditGrimoireMagicNameWizard } from './scenes/profile/grimoire/editGrimoireMagicWizard';
import { EditGrimoireMagicColorWizard } from './scenes/profile/grimoire/editMagicColorWizard';
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
        AllDevilsWizard,
        AllSpirtsWizard,
        MapWizard,
        BioWizard,
        CharacterParametersWizard,
        CreateSpellWizard,
        CreateCharacterWizard,
        EquipmentWizard,
        GrimoireWizard,
        EditGrimoireMagicColorWizard,
        EditGrimoireMagicNameWizard,
        InventoryWizard,
        MyDevilsWizard,
        MySpiritsWizard,
        ProfileWizard,
        WalletWizard,
        MinesWizard,
        SquadWizard,
        EntryWizard,
        TgBotUpdate,
        TgBotService,
        TgBotI18nService,
    ],
    exports: [TgBotI18nService],
})
export class TgBotModule {}
