import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { CreateDevilDto } from '../dtos/create.devil.dto';
@Injectable()
export class DevilsService {
    constructor(
        @InjectRepository(DevilEntity)
        private readonly devilrepository: Repository<DevilEntity>
    ) {}

    async getDevils(
        dto: PaginationListDto,
        rank: Record<string, any>,
        floor: Record<string, any>
    ): Promise<[DevilEntity[], number]> {
        console.log(rank, floor);
        const [entities, total] = await this.devilrepository.findAndCount({
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
    }
    async existByName(name: string): Promise<boolean> {
        const entity = await this.devilrepository.findOneBy({
            name: name,
        });
        return entity ? true : false;
    }
    async create(dto: CreateDevilDto) {
        const insert = await this.devilrepository.insert(dto);
        return insert.raw[0].id;
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

    findOne(id: string): Promise<DevilEntity | null> {
        return this.devilrepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.devilrepository.delete(id);
    }
}
