import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DrinkEntity } from './entities/drink.entity';
import FoodComponentEntity from './entities/food.component.entity';
import { MoneyModule } from '../money/money.module';
import { RecipeEntity } from './entities/recipe.entity';
import { RestaurantDrinksEntity } from './entities/restaurant.drinks.entity';
import { RestaurantMenuEntity } from './entities/restaurant.menu.entity';
import { ItemsModule } from '../items/items.module';
import { DrinkService } from './service/drink.service';
import { MenuService } from './service/menu.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            DrinkEntity,
            RecipeEntity,
            RestaurantDrinksEntity,
            RestaurantMenuEntity,
            FoodComponentEntity,
        ]),
        MoneyModule,
        ItemsModule,
    ],
    controllers: [],
    providers: [DrinkService, MenuService],
    exports: [DrinkService, MenuService],
})
export class CuisineModule {}
