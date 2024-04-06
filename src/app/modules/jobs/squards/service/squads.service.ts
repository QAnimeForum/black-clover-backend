import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SquadEntity } from '../entity/squad.entity';
@Injectable()
export class SquadsService {
    constructor(
        @InjectRepository(SquadEntity)
        private readonly squadEntity: Repository<SquadEntity>
    ) {}
}
