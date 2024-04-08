import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { StateEntity } from '../../../map/enitity/state.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
@Entity('squads')
export class SquadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;

    @ManyToOne(() => StateEntity)
    @JoinColumn({
        name: 'forces_id',
        referencedColumnName: 'id',
    })
    armorForces: ArmedForcesEntity;
    // ranks: any[];
}
