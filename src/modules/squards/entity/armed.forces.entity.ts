import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SquadEntity } from './squad.entity';
import { StateEntity } from '../../map/enitity/state.entity';
import { ArmedForcesRequestEntity } from './armed.forces.request.entity';
import { ArmedForcesMemberEntity } from './armed.forces.member.entity';

@Entity('armed_forces')
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
    description: string;

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

    @Column({
        type: 'varchar',
        name: 'state_id',
    })
    stateId: string;
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


    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
