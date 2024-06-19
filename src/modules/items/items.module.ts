import { Module } from '@nestjs/common';

import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { ClothesEntity } from './entity/clothes.entity';
import { HouseEnity } from './entity/house.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { VehicleEntity } from './entity/vehicle.entity';
import { ArmorClassEntity } from '../character/entity/armor.class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './controller/business.controller';
import { GearEntity } from './entity/gear.entity';
import { ClothesService } from './service/clothes.service';
import { GearService } from './service/gear.service';
import { ArmorService } from './service/armor.service';
import { ToolkitService } from './service/toolkit.service';
import { WeaponService } from './service/weapon.service';
import { InventoryService } from './service/inventory.service';
import { EquipmentEntity } from './entity/equipment.entity';
import { VehicleService } from './service/vehicles.service';
import { InventoryEntity } from './entity/inventory.entity';
import { EqupmentItemEntity } from './entity/equpment.item.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            EqupmentItemEntity,
            InventoryEntity,
            ArmorEntity,
            ArmorClassEntity,
            ClothesEntity,
            HouseEnity,
            GearEntity,
            ToolKitEnity,
            VehicleEntity,
            WeaponEntity,
            EquipmentEntity,
        ]),
    ],
    controllers: [BusinessController],
    providers: [
        ArmorService,
        ClothesService,
        GearService,
        ToolkitService,
        WeaponService,
        VehicleService,
        InventoryService,
    ],
    exports: [
        ArmorService,
        ClothesService,
        GearService,
        ToolkitService,
        WeaponService,
        VehicleService,
        InventoryService,
    ],
})
export class ItemsModule {}
