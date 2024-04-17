import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { RaceEntity } from './entity/race.entity';
import { CreateRaceDto } from './dto/create-race.dto';

@Injectable()
export class RaceService {
    constructor(
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>
    ) {}
    async findAllRaces(
        dto: PaginationListDto
    ): Promise<[RaceEntity[], number]> {
        const [entities, total] = await this.raceRepository.findAndCount({
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

    async raceExistByName(name: string): Promise<boolean> {
        const entity = await this.raceRepository.findOneBy({
            name: name,
        });
        return entity ? false : true;
    }

    async getRaceById(raceId: string): Promise<RaceEntity> {
        const entity = await this.raceRepository.findOneBy({
            id: raceId,
        });
        return entity;
    }

    createrRace(dto: CreateRaceDto) {
        return this.raceRepository.insert(dto);
    }
}
