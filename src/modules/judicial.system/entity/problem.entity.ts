import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
import { CourtWorkerEntity } from './court.worker.entity';
import { SubmissionEntity } from './submission.entity';

export enum ENUM_PROBLEM_STATUS {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    UNDER_CONSIDERATION = 'UNDER_CONSIDERATION',
    SOLVED = 'SOLVED',
}

@Entity('problem')
export class ProblemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer', nullable: false })
    @Generated('increment')
    @Index({ unique: true })
    displayId: number;

    @Column({ type: 'boolean' })
    isPublic: boolean;

    /* @Column({ type: 'timestamp', nullable: true })
    publicTime: Date;*/

    @ManyToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'creator_id',
        referencedColumnName: 'id',
    })
    creator: CharacterEntity;

    @Column({
        name: 'creator_id',
        type: 'uuid',
    })
    creatorId: string;

    @Column({
        type: 'enum',
        enum: ENUM_PROBLEM_STATUS,
        default: ENUM_PROBLEM_STATUS.DRAFT,
    })
    status: ENUM_PROBLEM_STATUS;

    @ManyToOne(() => CharacterEntity, (worker) => worker.problems, {
        nullable: true,
    })
    @JoinColumn({
        name: 'court_worker_id',
        referencedColumnName: 'id',
    })
    judge: CharacterEntity;


    @Column({
        name: 'court_worker_id',
        type: 'uuid',
        nullable: true,
    })
    judgeId: string;


    @Column({
        type: 'varchar',
    })
    content: string;

    @OneToOne(() => SubmissionEntity, { nullable: true })
    @JoinColumn({
        name: 'submission_id',
        referencedColumnName: 'id',
    })
    submission: SubmissionEntity;

    @Column({
        name: 'submission_id',
        type: 'uuid',
        nullable: true,
    })
    submissionId: string;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}

/**
 *     @Column({ type: 'integer' })
    submissionCount: number;

    @Column({ type: 'string' })
    judgeInfo: unknown;

 */
