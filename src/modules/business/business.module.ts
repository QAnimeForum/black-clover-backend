import { Module } from '@nestjs/common';

import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { ClothesEntity } from './entity/clothes.entity';
import { HouseEnity } from './entity/house.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { VehicleEntity } from './entity/vehicle.entity';
import { ArmorClassEntity } from '../character/entity/armor.class.entity';
import { BusinessEntity } from './entity/business.entity';
import { JobEntity } from './entity/job.entity';
import { InventoryEntity } from '../character/entity/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './controller/business.controller';
import { BusinessService } from './service/business.service';
import { GearEntity } from './entity/gear.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            InventoryEntity,
            ArmorEntity,
            BusinessEntity,
            JobEntity,
            ArmorClassEntity,
            ClothesEntity,
            HouseEnity,
            GearEntity,
            ToolKitEnity,
            VehicleEntity,
            WeaponEntity,
        ]),
    ],
    controllers: [BusinessController],
    providers: [BusinessService],
})
export class BuisnessModule {}
