import { Module } from '@nestjs/common';
import { CharacterController } from './controllers/character.controller';
import { CharacterService } from './services/character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntity } from './entity/race.entity';
import { CharacterEntity } from './entity/character.entity';
import { BackgroundEnity } from './entity/background.entity';
import { StateEntity } from '../map/enitity/state.entity';
import { InventoryEntity } from './entity/inventory.entity';
import { ArmorEntity } from '../business/entity/armor.entity';
import { ItemEnity } from '../business/entity/item.entity';
import { ToolKitEnity } from '../business/entity/toolkit.entity';
import { WalletEntity } from '../money/entity/wallet.entity';
import { WeaponEntity } from '../business/entity/weapon.entity';
import { GrimoireEntity } from './entity/grimoire.entity';
import { SpellEntity } from './entity/spell.entity';
import { AbilityEntity } from './entity/ability.entity';
import { ArmorClassEntity } from './entity/armor.class.entity';
import { CharacterCharacteristicsEntity } from './entity/character.characteristics.entity';
import { PassiveSkillEntity } from './entity/passive.skill.entity';
import { ProficiencyEntity } from './entity/proficiency.entity';
import { SkillEntity } from './entity/skill.entity';
import { SpeedEntity } from './entity/speed.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                SpeedEntity,
                CharacterCharacteristicsEntity,
                ArmorClassEntity,
                ArmorEntity,
                InventoryEntity,
                ItemEnity,
                ToolKitEnity,
                WalletEntity,
                WeaponEntity,
                CharacterEntity,
                ProficiencyEntity,
                AbilityEntity,
                SkillEntity,
                PassiveSkillEntity,
                ArmorClassEntity,
                BackgroundEnity,
                RaceEntity,
                StateEntity,
                InventoryEntity,
                GrimoireEntity,
                SpellEntity,
            ],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [CharacterController],
    providers: [CharacterService],
})
export class CharacterModule {}
