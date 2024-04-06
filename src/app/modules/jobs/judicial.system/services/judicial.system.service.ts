import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WantedEntity } from '../entity/wanted.entity';
@Injectable()
export class JudicialSystemService {
    constructor(
        @InjectRepository(WantedEntity)
        private readonly wantedEntity: Repository<WantedEntity>
    ) {}
}
