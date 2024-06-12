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
import { CharacterEntity } from '../../character/entity/character.entity';

@Entity('submission')
@Index(['isPublic', 'problemId', 'submitterId'])
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
    @ManyToOne(() => ProblemEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Promise<ProblemEntity>;

    @Column()
    @Index()
    problemId: string;

    @ManyToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'submitter_id',
    })
    submitter: CharacterEntity;

    @Column()
    @Index()
    submitterId: string;

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
