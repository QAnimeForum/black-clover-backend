import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DrinkEntity } from '../entities/drink.entity';
import { DrinkCreateDto } from '../dto/drink-create.dto';
import { DrinkUpdateNameDto } from '../dto/drink-edit.name.dto';
import { DrinkUpdateDescriptionDto } from '../dto/drink.edit-description';
@Injectable()
export class DrinkService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(DrinkEntity)
        private readonly drinkRepository: Repository<DrinkEntity>
    ) {}

    async create(dto: DrinkCreateDto) {
        const drink = new DrinkEntity();
        drink.name = dto.name;
        drink.description = dto.description;
        return this.drinkRepository.save(drink);
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
}
