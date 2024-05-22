import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SubmissionEntity } from '../entity/submission.entity';
import { ProblemService } from './problem.service';
import { CharacterEncoding } from 'crypto';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { SubmissionStatus } from '../constants/submission-status.enum';
import { ProblemEntity } from '../entity/problem.entity';
import { SubmissionBasicMetaDto } from '../dto/submission-basic-meta.dto';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectDataSource()
        private connection: DataSource,
        @InjectRepository(SubmissionEntity)
        private readonly submissionRepository: Repository<SubmissionEntity>,

        @Inject(forwardRef(() => ProblemService))
        private readonly problemService: ProblemService
    ) {}

    async findSubmissionById(submissionId: string): Promise<SubmissionEntity> {
        return await this.submissionRepository.findOneBy({
            id: submissionId,
        });
    }

    async findSubmissionsByExistingIds(
        submissionIds: string[]
    ): Promise<SubmissionEntity[]> {
        if (submissionIds.length === 0) return [];
        const uniqueIds = Array.from(new Set(submissionIds));
        const records = await this.submissionRepository.findBy({
            id: In(uniqueIds),
        });
        const map = Object.fromEntries(
            records.map((record) => [record.id, record])
        );
        return submissionIds.map((submissionId) => map[submissionId]);
    }

    async userHasPermission(): Promise<boolean> {
        return true;
    }

    async createSubmission(
        submitter: CharacterEntity,
        problem: ProblemEntity,
        content: string
    ) {
        const submission = new SubmissionEntity();
        submission.isPublic = problem.isPublic;

        submission.status = SubmissionStatus.Pending;
        submission.submitTime = new Date();
        submission.problemId = problem.id;
        submission.submitterId = submitter.id;
        submission.content = content;
        const result = await this.submissionRepository.save(submission);
        return result;
    }
/*
    async getSubmissionBasicMeta(
        submission: SubmissionEntity
    ): Promise<SubmissionBasicMetaDto> {
        return {
            id: submission.id,
            isPublic: submission.isPublic,
            status: submission.status,
            submitTime: submission.submitTime,
         content: submission.content,
        };
    }*/

    private async onSubmissionFinished(
        submission: SubmissionEntity,
        problem: ProblemEntity,
        status: SubmissionStatus
    ): Promise<void> {
        submission.status = status;
        this.submissionRepository.save(submission);
    }
}
