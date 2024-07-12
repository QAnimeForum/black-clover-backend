import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { CourtWorkerEntity } from '../entity/court.worker.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ENUM_PROBLEM_STATUS, ProblemEntity } from '../entity/problem.entity';

@Injectable()
export class CourtWorkerService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(CourtWorkerEntity)
        private readonly courtWorkerRepository: Repository<CourtWorkerEntity>,
        @InjectRepository(ProblemEntity)
        private readonly problemRepository: Repository<ProblemEntity>
    ) {}

    async createCourtWorker(characterId: string) {
        const worker = new CourtWorkerEntity();
        worker.characterId = characterId;
        return this.courtWorkerRepository.insert(worker);
    }

    async deleteWorker(characterId: string) {
        const worker = await this.courtWorkerRepository.findOneBy({
            characterId: characterId,
        });
        return this.courtWorkerRepository.remove(worker);
    }

    async isWorker(tgUserId: string) {
        return await this.courtWorkerRepository.existsBy({
            character: {
                user: {
                    tgUserId: tgUserId,
                },
            },
        });
    }

    public async findWorkerById(characterId: string) {
        const worker = await this.courtWorkerRepository.findOneBy({
            characterId: characterId,
        });
        return worker;
    }
    public async addJudgeToProblem(characterId: string, problemId: string) {

        return await this.connection
            .createQueryBuilder()
            .update(ProblemEntity)
            .set({
                judgeId: characterId,
                status: ENUM_PROBLEM_STATUS.UNDER_CONSIDERATION,
            })
            .where('id = :id', { id: problemId })
            .execute();
    }

    public async removeJudgeToProblem(problemId: string) {
        return await this.connection
            .createQueryBuilder()
            .update(ProblemEntity)
            .set({ judge: null, status: ENUM_PROBLEM_STATUS.PENDING })
            .where('id = :id', { id: problemId })
            .execute();
    }
    public findAllWorkers(
        query: PaginateQuery
    ): Promise<Paginated<CourtWorkerEntity>> {
        return paginate(query, this.courtWorkerRepository, {
            sortableColumns: [
                'id',
                'character',
                'character.background',
                'character.background.name',
                'character.user',
            ],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: [
                'id',
                'character',
                'character.id',
                'character.background',
                'character.background.name',
            ],

            select: [
                'id',
                'character',
                'character.id',
                'character.background',
                'character.background.name',
                'character.user.tgUserId',
            ],

            relations: ['character', 'character.background', 'character.user'],
        });
    }
}
