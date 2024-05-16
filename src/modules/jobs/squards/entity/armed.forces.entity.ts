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
import { ArmedForcesRequestEntity } from './armed.forces.request.entity';
import { ArmedForcesMemberEntity } from './armed.forces.member.entity';

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

    /**
    *  @Column({
        type: 'varchar',
        nullable: true,
    })
    leader: string;
    */
    @OneToOne(() => StateEntity)
    @JoinColumn({
        name: 'state_id',
        referencedColumnName: 'id',
    })
    state: StateEntity;
    @OneToMany(() => SquadEntity, (squad) => squad.armorForces)
    squads: Array<SquadEntity>;

    @OneToMany(() => ArmedForcesMemberEntity, (member) => member.armedForces)
    members: Array<ArmedForcesMemberEntity>;


    /*
    @OneToMany(() => ArmedForcesMemberEntity, (rank) => rank.armorForces)
    ranks: Array<ArmedForcesMemberEntity>;*/

    @OneToMany(
        () => ArmedForcesRequestEntity,
        (requests) => requests.armedForces
    )
    requests: Array<ArmedForcesRequestEntity>;
}
