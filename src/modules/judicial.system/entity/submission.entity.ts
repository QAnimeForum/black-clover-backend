import {
    Entity,
    PrimaryGeneratedColumn,
    Index,
    ManyToOne,
    Column,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ProblemEntity } from './problem.entity';

@Entity('submission')
//@Index(['isPublic', 'problemId', 'submitterId'])
/**
 * @Index(['isPublic', 'problemId', 'status'])
@Index(['isPublic', 'problemId', 'submitterId'])
@Index(['isPublic', 'submitterId', 'status'])
@Index(['isPublic', 'submitterId'])
@Index(['isPublic', 'status'])
@Index(['problemId', 'submitterId'])
@Index(['submitterId', 'status'])
@Index(['submitTime', 'submitterId'])
 */
export class SubmissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean' })
    @Index()
    isPublic: boolean;


/**
 *     @Column({ type: 'enum', enum: SubmissionStatus })
    @Index()
    status: SubmissionStatus;

 */
    @OneToOne(() => ProblemEntity, (problem) => problem.submission) // specify inverse side as a second parameter
    user: ProblemEntity;

    @Column({ type: 'timestamp' })
    @Index()
    submitTime: Date;

    /**
    *  @OneToOne(
        () => SubmissionDetailEntity,
        (submissionDetail) => submissionDetail.submission
    )
    detail: Promise<SubmissionDetailEntity>;
    */

    @Column({ type: 'varchar' })
    content: string;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
