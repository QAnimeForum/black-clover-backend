import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FactionMemberEntity } from './faction.member.entity';

@Entity('faction_rank')
export class FactionRankEntity {
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

    @OneToMany(() => FactionMemberEntity, (member) => member.faction)
    members: Array<FactionMemberEntity>;
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
