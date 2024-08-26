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
import { InventoryEntity, InventoryEqipmentItemsEntity } from './entity/inventory.entity';
import { EqupmentItemEntity } from './entity/equpment.item.entity';
import { MarketEntity } from './entity/market.entity';
import { ItemCategoryEntity } from './entity/item.category.entity';
import { EqupmentItemService } from './service/equipment.item.service';
import { MarketService } from './service/market.service';
import { MoneyModule } from '../money/money.module';
import { ShopService } from './service/shop.service';
import { ShopEntity } from './entity/shop.entity';
import { CharacterEntity } from '../character/entity/character.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            EqupmentItemEntity,
            InventoryEntity,
            ItemCategoryEntity,
            ArmorEntity,
            ArmorClassEntity,
            ClothesEntity,
            HouseEnity,
            GearEntity,
            ToolKitEnity,
            VehicleEntity,
            WeaponEntity,
            EquipmentEntity,
            MarketEntity,
            ShopEntity,
            InventoryEqipmentItemsEntity,
            CharacterEntity,
        ]),
        MoneyModule,
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
        EqupmentItemService,
        MarketService,
        ShopService,
    ],
    exports: [
        ArmorService,
        ClothesService,
        GearService,
        ToolkitService,
        WeaponService,
        VehicleService,
        InventoryService,
        EqupmentItemService,
        MarketService,
        ShopService,
    ],
})
export class ItemsModule {}
