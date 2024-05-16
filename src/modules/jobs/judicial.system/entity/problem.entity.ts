import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../../../modules/character/entity/character.entity';

export enum ProblemType {
    Traditional = 'Traditional',
    Interaction = 'Interaction',
    SubmitAnswer = 'SubmitAnswer',
}

@Entity('problem')
export class ProblemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer', nullable: true })
    @Index({ unique: true })
    displayId: number;

    @Column({ type: 'enum', enum: ProblemType })
    type: ProblemType;

    @Column({ type: 'boolean' })
    isPublic: boolean;

    @Column({ type: 'timestamp', nullable: true })
    publicTime: Date;

    @ManyToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'owner_id',
        referencedColumnName: 'id',
    })
    owner: Promise<CharacterEntity>;

    @Column()
    ownerId: string;

    @Column({ type: 'integer' })
    submissionCount: number;

    @Column({ type: 'integer' })
    acceptedSubmissionCount: number;

    @Column({ type: 'string' })
    judgeInfo: unknown;

    @Column({ type: 'boolean', default: true })
    submittable: boolean;
}
