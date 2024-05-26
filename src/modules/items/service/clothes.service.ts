import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClothesEntity } from '../entity/clothes.entity';
import { ClothesCreateDto } from '../dto/clothes.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class ClothesService {
    constructor(
        @InjectRepository(ClothesEntity)
        private readonly clothesRepository: Repository<ClothesEntity>
    ) {}

    findClothesById(id: string): Promise<ClothesEntity | null> {
        return this.clothesRepository.findOneBy({ id });
    }

    async createClothes(dto: ClothesCreateDto) {
        await this.clothesRepository.insert(dto);
    }

    public findAllClothes(
        query: PaginateQuery
    ): Promise<Paginated<ClothesEntity>> {
        return paginate(query, this.clothesRepository, {
            sortableColumns: ['id', 'category'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['category'],
            select: ['id', 'name'],
            filterableColumns: {
                category: [FilterOperator.EQ],
            },
        });
    }

    async deleteClothes(id: string): Promise<void> {
        await this.clothesRepository.delete(id);
    }
}
