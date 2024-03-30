import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MineralEnity } from '../entities/mineral.entity';

@Injectable()
export class MineService {
    constructor(
        @InjectRepository(MineralEnity)
        private readonly mineralEntiry: Repository<MineralEnity>
    ) {}
}
