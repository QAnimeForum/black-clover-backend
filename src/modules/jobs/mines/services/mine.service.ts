import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MineEntity } from '../entities/mine.entity';
import { MineralEntity } from '../entities/mineral.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class MineService {
    constructor(
        @InjectRepository(MineralEntity)
        private readonly mineralRepository: Repository<MineralEntity>,
        @InjectRepository(MineEntity)
        private readonly mineRepository: Repository<MineEntity>
    ) {}
    public findAll(query: PaginateQuery): Promise<Paginated<MineralEntity>> {
        return paginate(query, this.mineralRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                name: true,
            },
        });
    }
    async findMineralsNames(): Promise<[MineralEntity[], number]> {
        const [minerals, total] = await this.mineralRepository.findAndCount({
            select: {
                id: true,
                name: true,
            },
        });
        return [minerals, total];
    }

    async findMineralById(mineralId: string) {
        return this.mineralRepository.findOne({
            where: {
                id: mineralId,
            },
        });
    }
}
