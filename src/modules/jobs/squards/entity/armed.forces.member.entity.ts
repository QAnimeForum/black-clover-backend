import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../../character/entity/character.entity';
import { SquadEntity } from './squad.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
import { ArmedForcesRankEntity } from './armed.forces.rank.entity';

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

    @ManyToOne(() => SquadEntity, (squad) => squad.members)
    @JoinColumn({
        name: 'ar',
        referencedColumnName: 'id',
    })
    armedForces: ArmedForcesEntity;

    @ManyToOne(() => ArmedForcesRankEntity, (rank) => rank.members)
    @JoinColumn({
        name: 'rank_id',
        referencedColumnName: 'id',
    })
    rank: ArmedForcesRankEntity;
}
