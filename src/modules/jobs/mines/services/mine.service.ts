import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MineEntity } from '../entities/mine.entity';
import { MineralEntity } from '../entities/mineral.entity';

@Injectable()
export class MineService {
    constructor(
        @InjectRepository(MineralEntity)
        private readonly mineralRepository: Repository<MineralEntity>,
        @InjectRepository(MineEntity)
        private readonly mineRepository: Repository<MineEntity>
    ) {}

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
