import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MineralEnity } from '../entities/mineral.entity';
import { MineEntity } from '../entities/mine.enitity';

@Injectable()
export class MineService {
    constructor(
        @InjectRepository(MineralEnity)
        private readonly mineralRepository: Repository<MineralEnity>,
        @InjectRepository(MineEntity)
        private readonly mineRepository: Repository<MineEntity>
    ) {}
}
