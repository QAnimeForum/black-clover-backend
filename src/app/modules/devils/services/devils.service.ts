import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { FilterDevilDto, SortDevilDto } from '../dtos/query.devil.dto';
import { IPaginationOptions } from 'src/common/pagination/interfaces/pagination.interface';
import { Devil } from '../domain/devil';
import { DevilMapper } from '../devils.mapper';

@Injectable()
export class DevilsService {
    constructor(
        @InjectRepository(DevilEntity)
        private readonly devilrepository: Repository<DevilEntity>
    ) {}

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterDevilDto | null;
        sortOptions?: SortDevilDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<Devil[]> {
        const where: FindOptionsWhere<DevilEntity> = {};
        if (filterOptions?.rank) {
            where.rank = filterOptions.rank;
        }

        const entities = await this.devilrepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {}
            ),
        });

        return entities.map((devil) => DevilMapper.toDomain(devil));
    }
    findAll(): Promise<DevilEntity[]> {
        return this.devilrepository.find();
    }

    findByRank(rank: DevilRanksEnum): Promise<DevilEntity[]> {
        return this.devilrepository.find({
            where: {
                rank: rank,
            },
        });
    }

    findByFloor(floor: DevilFloorEnum): Promise<DevilEntity[]> {
        return this.devilrepository.find({
            where: {
                floor: floor,
            },
        });
    }

    findOne(id: number): Promise<DevilEntity | null> {
        return this.devilrepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.devilrepository.delete(id);
    }
}
