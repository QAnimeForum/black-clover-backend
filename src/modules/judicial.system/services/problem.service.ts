import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { WantedEntity } from '../entity/wanted.entity';
import { ProblemJudgeInfoEntity } from '../entity/problem-judge-info.entity';
import {
    ENUM_PROBLEM_STATUS,
    ProblemEntity,
    ProblemType,
} from '../entity/problem.entity';

import { UserPrivilegeService } from 'src/modules/user/services/user-privilege.service';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { SubmissionService } from './submission.service';
import { CourtWorkerEntity } from '../entity/court.worker.entity';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class ProblemService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(WantedEntity)
        private readonly wantedEntity: Repository<WantedEntity>,
        @InjectRepository(ProblemEntity)
        private readonly problemRepository: Repository<ProblemEntity>,
        @InjectRepository(ProblemJudgeInfoEntity)
        private readonly problemJudgeInfoRepository: Repository<ProblemJudgeInfoEntity>,
        @InjectRepository(CourtWorkerEntity)
        private readonly courtWorkerRepository: Repository<CourtWorkerEntity>,
        @Inject(forwardRef(() => SubmissionService))
        private readonly submissionService: SubmissionService,
        @Inject(forwardRef(() => UserPrivilegeService))
        private readonly userPrivilegeService: UserPrivilegeService
    ) {}

    async findProblemById(id: string): Promise<ProblemEntity> {
        return await this.problemRepository.findOneBy({ id });
    }

    async findProblemsByExistingIds(
        problemIds: string[]
    ): Promise<ProblemEntity[]> {
        if (problemIds.length === 0) return [];
        const uniqueIds = Array.from(new Set(problemIds));
        const records = await this.problemRepository.findBy({
            id: In(uniqueIds),
        });
        const map = Object.fromEntries(
            records.map((record) => [record.id, record])
        );
        return problemIds.map((problemId) => map[problemId]);
    }

    async findProblemByDisplayId(displayId: number): Promise<ProblemEntity> {
        return await this.problemRepository.findOneBy({
            displayId,
        });
    }

    public findAllProblems(
        query: PaginateQuery
    ): Promise<Paginated<ProblemEntity>> {
        return paginate(query, this.problemRepository, {
            sortableColumns: ['id', 'displayId', 'status'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['displayId'],
            select: ['id', 'displayId', 'status', 'content', 'creator_id'],
            filterableColumns: {
                creator_id: [FilterOperator.EQ],
            },
        });
    }

    async createProblem(
        creator: CharacterEntity,
        type: ProblemType,
        content: string
    ): Promise<ProblemEntity> {
        /**
       *   const problem = new ProblemEntity();
        problem.type = type;
        problem.isPublic = true;
        problem.status = ENUM_PROBLEM_STATUS.DRAFT;
        problem.creatorId = creator.id;
        problem.content = content;
       */
        return await this.problemRepository.save({
            type,
            isPublic: true,
            status: ENUM_PROBLEM_STATUS.DRAFT,
            creatorId: creator.id,
            content,
        });
    }

    async changeProblemState(
        problemId: string,
        state: ENUM_PROBLEM_STATUS
    ): Promise<ProblemEntity> {
        const problem = await this.findProblemById(problemId);
        if (state == ENUM_PROBLEM_STATUS.DRAFT && problem) {
            return problem;
        }
        problem.status = state;
        return await this.problemRepository.save(problem);
    }

    async changeProblemContent(
        problemId: string,
        content: string
    ): Promise<ProblemEntity> {
        const problem = await this.findProblemById(problemId);
        problem.content = content;
        return await this.problemRepository.save(problem);
    }
}
