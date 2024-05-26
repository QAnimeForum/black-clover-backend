import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RaceEntity } from './entity/race.entity';
import { CreateRaceDto } from './dto/create-race.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
@Injectable()
export class RaceService {
    constructor(
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>
    ) {}
    public findAll(query: PaginateQuery): Promise<Paginated<RaceEntity>> {
        return paginate(query, this.raceRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: ['id', 'name'],
        });
    }

    async raceExistByName(name: string): Promise<boolean> {
        const entity = await this.raceRepository.findOneBy({
            name: name,
        });
        return entity ? false : true;
    }

    async findRaceById(raceId: string): Promise<RaceEntity> {
        const entity = await this.raceRepository.findOneBy({
            id: raceId,
        });
        return entity;
    }

    createrRace(dto: CreateRaceDto) {
        return this.raceRepository.insert(dto);
    }
}
