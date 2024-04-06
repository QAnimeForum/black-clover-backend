import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { SalaryEntity } from 'src/app/modules/money/entity/amount.entity';
@Entity('rank')
export class RankEntity {
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


    
    salary: SalaryEntity;

    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
