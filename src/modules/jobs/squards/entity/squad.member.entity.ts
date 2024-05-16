import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SquadEntity } from './squad.entity';
import { ArmedForcesMemberEntity } from './armed.forces.member.entity';

@Entity('squad_member')
export class SquadMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => ArmedForcesMemberEntity)
    @JoinColumn({
        name: 'armed_forces_member_id',
        referencedColumnName: 'id',
    })
    armedForcesMember: ArmedForcesMemberEntity;

    @ManyToOne(() => SquadEntity, (squad) => squad.members)
    @JoinColumn({
        name: 'squad_id',
        referencedColumnName: 'id',
    })
    squad: SquadEntity;
}
