import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { SalaryEntity } from '../../../money/entity/amount.entity';
@Entity('rank')
export class SquadRankEntity {
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
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
