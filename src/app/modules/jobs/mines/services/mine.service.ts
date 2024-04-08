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
}
