import { Module } from '@nestjs/common';
import { CharacterController } from './controllers/character.controller';
import { CharacterService } from './services/character.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntity } from '../race/entity/race.entity';
import { CharacterEntity } from './entity/character.entity';
import { BackgroundEntity } from './entity/background.entity';
import { StateEntity } from '../map/enitity/state.entity';
import { InventoryEntity } from './entity/inventory.entity';
import { WalletEntity } from '../money/entity/wallet.entity';
import { GrimoireEntity } from '../grimoire/entity/grimoire.entity';
import { SpellEntity } from '../grimoire/entity/spell.entity';
import { AbilityEntity } from './entity/ability.entity';
import { ArmorClassEntity } from './entity/armor.class.entity';
import { CharacterCharacteristicsEntity } from './entity/character.characteristics.entity';
import { PassiveSkillEntity } from './entity/passive.skill.entity';
import { ProficiencyEntity } from './entity/proficiency.entity';
import { SkillEntity } from './entity/skill.entity';
import { SpeedEntity } from './entity/speed.entity';
import { WeaponEntity } from '../items/entity/weapon.entity';
import { ArmorEntity } from '../items/entity/armor.entity';
import { ToolKitEnity } from '../items/entity/toolkit.entity';
import { VehicleEntity } from '../items/entity/vehicle.entity';
import { CashEntity } from '../money/entity/cash.entity';
import { GearEntity } from '../items/entity/gear.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BackgroundService } from './services/background.service';
import { CharacteristicService } from './services/characteristics.service';
import { WalletService } from './services/wallet.service';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                SpeedEntity,
                CharacterCharacteristicsEntity,
                ArmorClassEntity,
                InventoryEntity,
                WalletEntity,
                CharacterEntity,
                ProficiencyEntity,
                AbilityEntity,
                SkillEntity,
                PassiveSkillEntity,
                ArmorClassEntity,
                BackgroundEntity,
                RaceEntity,
                StateEntity,
                InventoryEntity,
                GrimoireEntity,
                SpellEntity,

                WeaponEntity,
                ArmorEntity,
                ToolKitEnity,
                GearEntity,
                VehicleEntity,
                WalletEntity,
                CashEntity,
                UserEntity,
            ],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [CharacterController],
    providers: [
        CharacterService,
        BackgroundService,
        CharacteristicService,
        WalletService,
    ],
    exports: [CharacterService],
})
export class CharacterModule {}
