import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
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

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
