import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DrinkEntity } from './entities/drink.entity';
import FoodComponentEntity from './entities/food.component.entity';
import CuisineEntity from './entities/cuisine.enitity';
import { MoneyModule } from '../money/money.module';
import DrinkTypeEntity from './entities/drink.type.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CuisineEntity,
            DrinkEntity,
            DrinkTypeEntity,
            FoodComponentEntity,
        ]),
        MoneyModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class CuisineModule {}
