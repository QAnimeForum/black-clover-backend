import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { WantedEntity } from '../entity/wanted.entity';
import { ProblemFileEntity } from '../entity/problem-file.entity';
import { ProblemJudgeInfoEntity } from '../entity/problem-judge-info.entity';
import { ProblemEntity, ProblemType } from '../entity/problem.entity';

import { ProblemTagEntity } from '../entity/problem-tag.entity';
import { UserPrivilegeService } from 'src/modules/user/services/user-privilege.service';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { ProblemStatementDto } from '../dto/problem-statement.dto';
import { ProblemTagMapEntity } from '../entity/problem-tag-map.entity';
import { ProblemMetaDto } from '../dto/problem-meta.dto';
import { ProblemPermissionType } from '../constants/problem.permission.type.enum';

export interface ProblemJudgeInfo {}
export interface SubmissionContent {}

@Injectable()
export class ProblemSystemService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(WantedEntity)
        private readonly wantedEntity: Repository<WantedEntity>,
        @InjectRepository(ProblemEntity)
        private readonly problemRepository: Repository<ProblemEntity>,
        @InjectRepository(ProblemJudgeInfoEntity)
        private readonly problemJudgeInfoRepository: Repository<ProblemJudgeInfoEntity>,
        @InjectRepository(ProblemFileEntity)
        private readonly problemFileRepository: Repository<ProblemFileEntity>,
        @InjectRepository(ProblemTagEntity)
        private readonly problemTagRepository: Repository<ProblemTagEntity>,
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

    async getProblemMeta(problem: ProblemEntity): Promise<ProblemMetaDto> {
        const meta: ProblemMetaDto = {
            id: problem.id,
            displayId: problem.displayId,
            type: problem.type,
            publicTime: problem.publicTime,
            isPublic: problem.isPublic,
            ownerId: problem.ownerId,
        };

        return meta;
    }

    // TODO
    async characterHasPermission(
        character: CharacterEntity,
        problem: ProblemEntity,
        type: ProblemPermissionType
    ): Promise<boolean> {
        switch (type) {
            // Everyone can view a public problem
            // Owner, admins and those who has read permission can view a non-public problem
            case ProblemPermissionType.View: {
                return true;
            }
            case ProblemPermissionType.Modify: {
                return true;
            }
            case ProblemPermissionType.ManagePermission: {
                return true;
            }
        }
    }
    // TODO
    async getUserPermissions(
        character: CharacterEntity,
        problem: ProblemEntity
    ): Promise<ProblemPermissionType[]> {
        if (!character)
            return problem.isPublic ? [ProblemPermissionType.View] : [];
        const result: ProblemPermissionType[] = [];
        return result;
    }

    // TODO
    async createProblem(
        owner: CharacterEntity,
        type: ProblemType,
        statement: ProblemStatementDto,
        tags: ProblemTagEntity[]
    ): Promise<ProblemEntity> {
        let problem: ProblemEntity;
        return problem;
    }

    // TODO
 
    /**   async updateProblemStatement(
        problem: ProblemEntity,
        request: UpdateProblemStatementRequestDto,
        tags: ProblemTagEntity[]
    ): Promise<boolean> {} */
    async setProblemTags(
        problem: ProblemEntity,
        problemTags: ProblemTagEntity[],
        transactionalEntityManager: EntityManager
    ): Promise<void> {
        await transactionalEntityManager.delete(ProblemTagMapEntity, {
            problemId: problem.id,
        });
        if (problemTags.length === 0) return;
    /**
     *     await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(ProblemTagMapEntity)
            .values(
                problemTags.map((problemTag) => ({
                    problemId: problem.id,
                    problemTagId: problemTag.id,
                }))
            )
            .execute();
     */
    }

    async setProblemDisplayId(
        problem: ProblemEntity,
        displayId: number
    ): Promise<boolean> {
        if (!displayId) displayId = null;
        if (problem.displayId === displayId) return true;

        try {
            problem.displayId = displayId;
            await this.problemRepository.save(problem);
            return true;
        } catch (e) {
            if (
                await this.problemRepository.countBy({
                    displayId,
                })
            )
                return false;

            throw e;
        }
    }

    async setProblemPublic(
        problem: ProblemEntity,
        isPublic: boolean
    ): Promise<void> {
        problem.isPublic = isPublic;
        if (isPublic) problem.publicTime = new Date();
        await this.problemRepository.save(problem);
        // await this.submissionService.setSubmissionsPublic(problem.id, isPublic);
    }

    async findProblemTagById(id: number): Promise<ProblemTagEntity> {
        return await this.problemTagRepository.findOneBy({ id });
    }

    async findProblemTagsByExistingIds(
        problemTagIds: number[]
    ): Promise<ProblemTagEntity[]> {
        if (problemTagIds.length === 0) return [];
        const uniqueIds = Array.from(new Set(problemTagIds));
        const records = await this.problemTagRepository.findByIds(uniqueIds);
        const map = Object.fromEntries(
            records.map((record) => [record.id, record])
        );
        return problemTagIds.map((problemId) => map[problemId]);
    }

    async getAllProblemTags(): Promise<ProblemTagEntity[]> {
        return await this.problemTagRepository.find();
    }

    //TODO
    async createProblemTag(
        name: string,
        color: string
    ): Promise<ProblemTagEntity> {
        const problemTag = new ProblemTagEntity();
        problemTag.color = color;
        problemTag.name = name;
        return await this.problemTagRepository.save(problemTag);
    }

    // TODO
    async updateProblemTag(
        problemTag: ProblemTagEntity,
        name: string,
        color: string
    ): Promise<void> {}

    //TODO
    async deleteProblemTag(problemTag: ProblemTagEntity): Promise<void> {}
}
