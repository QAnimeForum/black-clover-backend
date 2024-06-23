import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SubmissionEntity } from '../entity/submission.entity';
import { ProblemService } from './problem.service';
import { CharacterEncoding } from 'crypto';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { SubmissionStatus } from '../constants/submission-status.enum';
import { ENUM_PROBLEM_STATUS, ProblemEntity } from '../entity/problem.entity';
import { SubmissionBasicMetaDto } from '../dto/submission-basic-meta.dto';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectDataSource()
        private connection: DataSource,
        @InjectRepository(SubmissionEntity)
        private readonly submissionRepository: Repository<SubmissionEntity>,
        @InjectRepository(ProblemEntity)
        private readonly problemRepository: Repository<ProblemEntity>,

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

    async createSubmission(problemId: string, content: string) {
        console.log(problemId);
        const submission = new SubmissionEntity();
        submission.isPublic = false;

        // submission.status = SubmissionStatus.Pending;
        submission.submitTime = new Date();
        //  submission.problemId = problem.id;
        //  submission.submitterId = submitter.id;
        submission.content = content;
        await this.submissionRepository.save(submission);
        console.log(problemId);
        const result = await this.connection
            .createQueryBuilder()
            .update(ProblemEntity)
            .set({
                submissionId: submission.id,
                status: ENUM_PROBLEM_STATUS.SOLVED,
            })
            .where('id = :id', { id: problemId })
            .execute();
        console.log('wtg');
        console.log(result);
        // this.problemRepository.save(submission);
        return submission;
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

    /**
    *  private async onSubmissionFinished(
        submission: SubmissionEntity,
        problem: ProblemEntity,
        status: SubmissionStatus
    ): Promise<void> {
        submission.status = status;
        this.submissionRepository.save(submission);
    }
    */
}
