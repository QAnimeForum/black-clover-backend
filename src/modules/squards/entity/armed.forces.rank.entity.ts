import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { SalaryEntity } from '../../money/entity/amount.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
@Entity('rank')
export class ArmedForcesRankEntity {
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

    @OneToOne(() => SalaryEntity)
    @JoinColumn({
        name: 'salary_id',
        referencedColumnName: 'id',
    })
    salary: SalaryEntity;

    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;

    @ManyToOne(() => ArmedForcesEntity)
    @JoinColumn({
        name: 'forces_id',
        referencedColumnName: 'id',
    })
    armorForces: ArmedForcesEntity;
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
