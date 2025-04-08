import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DrinkEntity } from '../entities/drink.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { RestaurantMenuEntity } from '../entities/restaurant.menu.entity';
import { RestaurantDrinksEntity } from '../entities/restaurant.drinks.entity';
import { OfferAmmountDto } from 'src/modules/money/dto/money-add.dto';
@Injectable()
export class MenuService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(DrinkEntity)
        private readonly drinkRepository: Repository<DrinkEntity>,
        @InjectRepository(RestaurantMenuEntity)
        private readonly restaurantMenuRepository: Repository<RestaurantMenuEntity>,
        @InjectRepository(RestaurantDrinksEntity)
        private readonly restaurantDrinksRepository: Repository<RestaurantDrinksEntity>
    ) {}

    async creeateDrinkInMenu(menuId: string, offerAmount: OfferAmmountDto) {
        return this.restaurantDrinksRepository.create({
            menuId: menuId,
            drinkId: offerAmount.itemId,
            copper: offerAmount.copper,
            silver: offerAmount.silver,
            electrum: offerAmount.electrum,
            gold: offerAmount.gold,
            platinum: offerAmount.platinum,
        });
    }
    async findRestrantMenus(query: PaginateQuery) {
        return paginate(query, this.restaurantMenuRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                categoryId: true,
            },
        });
    }

    async findRestrantMenu(id: string) {
        return this.restaurantMenuRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async findRestrantDrinks(query: PaginateQuery) {
        return paginate(query, this.restaurantDrinksRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: ['id', 'drink.id', 'drink.name'],
            filterableColumns: {
                menuId: true,
            },
            relations: ['drink'],
        });
    }

    async countDrinkInMenu(menuId: string) {
        return await this.restaurantDrinksRepository.countBy({
            menuId: menuId,
        });
    }
}
