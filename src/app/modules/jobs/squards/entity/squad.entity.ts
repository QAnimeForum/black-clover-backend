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
        name: 'state_id',
        referencedColumnName: 'id',
    })
    state: StateEntity;
    // ranks: any[];
}
