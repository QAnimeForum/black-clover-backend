import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SquadEntity } from './squad.entity';
import { StateEntity } from '../../../map/enitity/state.entity';
import { SquadRankEntity } from './squad.rank.entity';

@Entity('armer_forces')
export class ArmedForcesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    descripiton: string;

    @OneToOne(() => StateEntity)
    @JoinColumn({
        name: 'state_id',
        referencedColumnName: 'id',
    })
    state: StateEntity;
    @OneToMany(() => SquadEntity, (squad) => squad.armorForces)
    squads: Array<SquadEntity>;

    @OneToMany(() => SquadRankEntity, (rank) => rank.armorForces)
    ranks: Array<SquadRankEntity>;
}
