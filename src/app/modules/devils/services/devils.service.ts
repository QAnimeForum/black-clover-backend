import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.floor.enum';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { CreateDevilDto } from '../dtos/devil.create.dto';
import { DevilUnionEntity } from '../entity/devil.union.entity';
import { DevilSpellEntity } from '../entity/devil.spell.entity';
@Injectable()
export class DevilsService {
    constructor(
        @InjectRepository(DevilEntity)
        private readonly devilRepository: Repository<DevilEntity>,
        @InjectRepository(DevilUnionEntity)
        private readonly devilUnionRepository: Repository<DevilUnionEntity>,
        @InjectRepository(DevilSpellEntity)
        private readonly devilSpellRepository: Repository<DevilSpellEntity>
    ) {}

    async getDevils(
        dto: PaginationListDto,
        rank: Record<string, any>,
        floor: Record<string, any>
    ): Promise<[DevilEntity[], number]> {
        console.log(rank, floor);
        const [entities, total] = await this.devilRepository.findAndCount({
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
        const entity = await this.devilRepository.findOneBy({
            name: name,
        });
        return entity ? true : false;
    }
    async create(dto: CreateDevilDto) {
        const devil_union_10: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_25: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_50: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_65: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_80: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_100: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const insert = await this.devilRepository.insert({
            name: dto.name,
            description: dto.description,
            rank: DevilRanksEnum[dto.rank],
            floor: DevilFloorEnum[dto.floor],
            magic_type: dto.magic_type,
            union_10: devil_union_10,
            union_25: devil_union_25,
            union_50: devil_union_50,
            union_65: devil_union_65,
            union_80: devil_union_80,
            union_100: devil_union_100,
        });
        return insert.raw[0].id;
    }
    findByRank(rank: DevilRanksEnum): Promise<DevilEntity[]> {
        return this.devilRepository.find({
            where: {
                rank: rank,
            },
        });
    }

    findByFloor(floor: DevilFloorEnum): Promise<DevilEntity[]> {
        return this.devilRepository.find({
            where: {
                floor: floor,
            },
        });
    }

    findOne(id: string): Promise<DevilEntity | null> {
        return this.devilRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.devilRepository.delete(id);
    }
}
