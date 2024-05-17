import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { SpiritEntity } from '../entity/spirit.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class SpiritService {
    constructor(
        @InjectRepository(SpiritEntity)
        private readonly spiritRepository: Repository<SpiritEntity>
    ) {}

    /*  async findAllDevils(
        dto: PaginationListDto
    ): Promise<[SpiritEntity[], number]> {
        const [entities, total] = await this.spiritEntity.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
        });
        return [entities, total];
    }*/


    public findAll(query: PaginateQuery): Promise<Paginated<SpiritEntity>> {
        return paginate(query, this.spiritRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name', 'floor'],
            filterableColumns: {
                name: true,
            },
        });
    }

    async findSpiritById(spiritId: string): Promise<SpiritEntity> {
        return await this.spiritRepository.findOneBy({
            id: spiritId,
        });
    }
}
