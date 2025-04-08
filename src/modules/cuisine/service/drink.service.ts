import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DrinkEntity } from '../entities/drink.entity';
import { DrinkCreateDto } from '../dto/drink-create.dto';
import { DrinkUpdateNameDto } from '../dto/drink-edit.name.dto';
import { DrinkUpdateDescriptionDto } from '../dto/drink.edit-description';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import fs from 'fs';
import { DrinkUpdatePhotoDto } from '../dto/drink-edit.photo';
import { RestaurantMenuEntity } from '../entities/restaurant.menu.entity';
import { RestaurantDrinksEntity } from '../entities/restaurant.drinks.entity';
@Injectable()
export class DrinkService {
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

    async create(dto: DrinkCreateDto) {
        const image = dto.imageUrl;
        const saveFormat = image
            .split('.')
            [image.split('.').length - 1].toLowerCase();
        const newName = `0.${saveFormat}`;

        const drink = new DrinkEntity();
        drink.name = dto.name;
        drink.description = dto.description;
        drink.imagePath = newName;
        drink.appearance = '';
        const savedItem = await this.drinkRepository.save(drink);

        const dir = `${process.env.APP_API_URL}/Assets/images/drink/${savedItem.id}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(image, `${dir}/${newName}`);
        return savedItem;
    }
    async updateName(dto: DrinkUpdateNameDto) {
        return await this.connection
            .createQueryBuilder()
            .update(DrinkEntity)
            .set({ name: dto.name })
            .where('id = :id', { id: dto.id })
            .execute();
    }

    async updateDescription(dto: DrinkUpdateDescriptionDto) {
        return await this.connection
            .createQueryBuilder()
            .update(DrinkEntity)
            .set({ description: dto.description })
            .where('id = :id', { id: dto.id })
            .execute();
    }

    async updatePhoto(dto: DrinkUpdatePhotoDto) {
        return await this.connection
            .createQueryBuilder()
            .update(DrinkEntity)
            .set({ imagePath: dto.photo })
            .where('id = :id', { id: dto.id })
            .execute();
    }
    async findDrinkById(drinkId: string) {
        return await this.drinkRepository.findOneBy({
            id: drinkId,
        });
    }
    async findAllDrinks(query: PaginateQuery) {
        return paginate(query, this.drinkRepository, {
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
}
