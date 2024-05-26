import { Module } from '@nestjs/common';

import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { ClothesEntity } from './entity/clothes.entity';
import { HouseEnity } from './entity/house.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { VehicleEntity } from './entity/vehicle.entity';
import { ArmorClassEntity } from '../character/entity/armor.class.entity';
import { BusinessEntity } from './entity/business.entity';
import { InventoryEntity } from '../character/entity/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './controller/business.controller';
import { GearEntity } from './entity/gear.entity';
import { ClothesService } from './service/clothes.service';
import { GearService } from './service/gear.service';
import { ArmorService } from './service/armor.service';
import { ToolkitService } from './service/toolkit.service';
import { WeaponService } from './service/weapon.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            InventoryEntity,
            ArmorEntity,
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
    providers: [
        ArmorService,
        ClothesService,
        GearService,
        ToolkitService,
        WeaponService,
    ],
})
export class ItemsModule {}
