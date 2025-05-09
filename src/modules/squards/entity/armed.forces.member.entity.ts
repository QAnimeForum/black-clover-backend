import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
import { ArmedForcesRankEntity } from './armed.forces.rank.entity';
import { ArmedForcesJobTitleEntity } from './armed.forces.job.title.entity';

@Entity('armed_forces_member')
export class ArmedForcesMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;

    @Column({
        type: 'varchar',
        name: 'character_id',
    })
    characterId: string;

    @ManyToOne(() => ArmedForcesEntity, (armedForces) => armedForces.members)
    @JoinColumn({
        name: 'armed_forces_id',
        referencedColumnName: 'id',
    })
    armedForces: ArmedForcesEntity;
    @Column({
        type: 'varchar',
        name: 'armed_forces_id',
    })
    armedForcesId: string;
    @ManyToOne(() => ArmedForcesRankEntity, (rank) => rank.members)
    @JoinColumn({
        name: 'rank_id',
        referencedColumnName: 'id',
    })
    rank: ArmedForcesRankEntity;

    @Column({
        type: 'varchar',
        name: 'rank_id',
    })
    rankId: string;

    @ManyToOne(() => ArmedForcesJobTitleEntity, (jobTitle) => jobTitle.members)
    @JoinColumn({
        name: 'job_title_id',
        referencedColumnName: 'id',
    })
    jobTitle: ArmedForcesJobTitleEntity;

    @Column({
        type: 'int',
        name: 'stars',
        default: 0,
    })
    stars: number;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
