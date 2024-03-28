import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { DevilMapper } from '../devils.mapper';
@Injectable()
export class DevilsService {
    constructor(
        @InjectRepository(DevilEntity)
        private readonly devilrepository: Repository<DevilEntity>
    ) {}

    async findAll() {
        const entities = await this.devilrepository.find();
        return entities.map((devil) => DevilMapper.toDomain(devil));
    }

    async findByPagination() {
        //const entities = await this.devilrepository.find();
 /*       const [entities, count] = await this.devilrepository.findAndCount({
            skip: paginationDto._offset,
            take: paginationDto._limit,
    
            order: paginationDto._availableOrderBy.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: paginationDto._availableOrderDirection,
                }),
                {}
            ),
        });
        return {
            devils: entities.map((devil) => DevilMapper.toDomain(devil)),
            total: count,
        }*/
    }

    /**
 * 
 * @param rank     async findManyWithPagination({
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
    async findAll<T = DevilEntity>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.devilrepository.<T>(find, options);
    }
 * @returns 
 */

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

    findOne(id: string): Promise<DevilEntity | null> {
        return this.devilrepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.devilrepository.delete(id);
    }
}
