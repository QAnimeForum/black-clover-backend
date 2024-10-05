import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DrinkEntity } from '../entities/drink.entity';
@Injectable()
export class RecipeService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(DrinkEntity)
        private readonly drinkEntity: Repository<DrinkEntity>,
    ) {}

  }
