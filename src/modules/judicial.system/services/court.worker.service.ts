import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { SubmissionService } from './submission.service';
import { CourtWorkerEntity } from '../entity/court.worker.entity';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
    PaginationType,
} from 'nestjs-paginate';

@Injectable()
export class CourtWorkerService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(CourtWorkerEntity)
        private readonly courtWorkerRepository: Repository<CourtWorkerEntity>
    ) {}

    public findAllWorkers(
        query: PaginateQuery
    ): Promise<Paginated<CourtWorkerEntity>> {
        return paginate(query, this.courtWorkerRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            select: ['id'],
        });
    }
}
