import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
import { SquadPositionsEntity } from './squad.positions.entity';
@Entity('squads')
export class SquadEntity {
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

    @Column({
        type: 'varchar',
    })
    image: string;
    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;

    @ManyToOne(() => ArmedForcesEntity)
    @JoinColumn({
        name: 'forces_id',
        referencedColumnName: 'id',
    })
    armorForces: ArmedForcesEntity;

    @OneToOne(() => SquadPositionsEntity)
    squadPositions: SquadPositionsEntity;
}
