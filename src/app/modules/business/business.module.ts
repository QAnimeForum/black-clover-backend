import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './business.controller';
import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { BusinessService } from './business.service';
import { ArmorClassEntity } from '../characters/entity/armor.class.entity';
import { ClothesEntity } from './entity/clothes.entity';
import { HouseEnity } from './entity/house.entity';
import { ItemEnity } from './entity/item.entity';
import { ToolKitEnity } from './entity/toolkit.entity';
import { VehicleEntity } from './entity/vehicle.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmorEntity,
            ArmorClassEntity,
            ClothesEntity,
            HouseEnity,
            ItemEnity,
            ToolKitEnity,
            VehicleEntity,
            WeaponEntity,
        ]),
    ],
    controllers: [BusinessController],
    providers: [BusinessService],
})
export class BuisnessModule {}
