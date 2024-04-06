import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
@Entity('rank')
export class RankEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'int',
    })
    salary: number;

    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
