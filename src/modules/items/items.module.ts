import { Module } from '@nestjs/common';

import { ClothesEntity } from './entity/clothes.entity';
import { HouseEnity } from './entity/house.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { VehicleEntity } from './entity/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GearEntity } from './entity/gear.entity';
import { ClothesService } from './service/clothes.service';
import { GearService } from './service/gear.service';
import { ToolkitService } from './service/toolkit.service';
import { InventoryService } from './service/inventory.service';
import { EquipmentEntity } from './entity/equipment.entity';
import { VehicleService } from './service/vehicles.service';
import { InventoryEntity } from './entity/inventory.entity';
import { EqupmentItemEntity } from './entity/equpment.item.entity';
import { MarketEntity } from './entity/market.entity';
import { ItemCategoryEntity } from './entity/item.category.entity';
import { EqupmentItemService } from './service/equipment.item.service';
import { MarketService } from './service/market.service';
import { MoneyModule } from '../money/money.module';
import { ShopService } from './service/shop.service';
import { ShopEntity } from './entity/shop.entity';
import { CharacterEntity } from '../character/entity/character.entity';
import { InventoryEqipmentItemsEntity } from './entity/inventory.eqipmentItems.entity';
import { BookEntity } from './entity/book.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            EqupmentItemEntity,
            InventoryEntity,
            ItemCategoryEntity,

            ClothesEntity,
            HouseEnity,
            GearEntity,
            ToolKitEnity,
            VehicleEntity,
            EquipmentEntity,
            MarketEntity,
            ShopEntity,
            CharacterEntity,
            InventoryEqipmentItemsEntity,
            BookEntity,
        ]),
        MoneyModule,
    ],
    controllers: [],
    providers: [
        ClothesService,
        GearService,
        ToolkitService,
        VehicleService,
        InventoryService,
        EqupmentItemService,
        MarketService,
        ShopService,
    ],
    exports: [
        ClothesService,
        GearService,
        ToolkitService,
        VehicleService,
        InventoryService,
        EqupmentItemService,
        MarketService,
        ShopService,
    ],
})
export class ItemsModule {}
