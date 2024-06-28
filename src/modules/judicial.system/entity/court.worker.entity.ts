import { CharacterEntity } from '../../character/entity/character.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProblemEntity } from './problem.entity';

@Entity('court_worker')
export class CourtWorkerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;
    @Column({
        name: 'character_id',
        type: 'uuid',
    })
    characterId: string;

    @ManyToOne(() => ProblemEntity, (problem) => problem.judge)
    problems: Array<ProblemEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
