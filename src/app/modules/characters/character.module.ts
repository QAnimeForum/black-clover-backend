import { Module } from '@nestjs/common';
import { CharacterController } from './controllers/character.controller';
import { CharacterService } from './services/character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntity } from './entity/race.entity';
import { CharacterEntity } from './entity/character.entity';
import {
    AbilityEntity,
    ArmorClassEntity,
    CharacterCharacteristicsEntity,
    PassiveSkillEntity,
    ProficiencyEntity,
    SkillEntity,
    SpeedEntity,
} from './entity/character.characteristics.entity';
import { BackgroundEnity } from './entity/background.entity';
import { StateEntity } from '../map/enitity/state.entity';
import { InventoryEntity } from './entity/inventory.entity';
import { ArmorEntity } from './entity/armor.entity';
import { ItemEnity } from './entity/item.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { WalletEntity } from './entity/wallet.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            CharacterCharacteristicsEntity,
            ArmorClassEntity,
            ArmorEntity,
            InventoryEntity,
            ItemEnity,
            ToolKitEnity,
            WalletEntity,
            WeaponEntity,
            CharacterEntity,
            CharacterCharacteristicsEntity,
            ProficiencyEntity,
            AbilityEntity,
            SkillEntity,
            PassiveSkillEntity,
            ArmorClassEntity,
            SpeedEntity,
            BackgroundEnity,
            RaceEntity,
            StateEntity,
            InventoryEntity,
            GrimoireEntity,
            SpellEntity,
        ]),
    ],
    controllers: [CharacterController],
    providers: [CharacterService],
})
export class CharacterModule {}
