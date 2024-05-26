import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';

export enum ProblemType {
    Traditional = 'Traditional',
    Interaction = 'Interaction',
    SubmitAnswer = 'SubmitAnswer',
}

export enum ENUM_PROBLEM_STATUS {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
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

    @Column({ type: 'enum', enum: ProblemType })
    type: ProblemType;

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
        type: 'string',
    })
    creatorId: string;

    @Column({
        type: 'enum',
        enum: ENUM_PROBLEM_STATUS,
        default: ENUM_PROBLEM_STATUS.DRAFT,
    })
    status: ENUM_PROBLEM_STATUS;
    @Column({
        type: 'varchar',
    })
    content: string;

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
