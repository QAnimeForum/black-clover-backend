import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FactionMemberEntity } from './faction.member.entity';
import { GangZoneEntity } from './gang.zone.entity';

@Entity('faction')
export class FactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'int',
    })
    money: number;

    @Column({
        type: 'int',
    })
    materials: number;

    @OneToMany(() => FactionMemberEntity, (member) => member.faction)
    members: Array<FactionMemberEntity>;

    @OneToOne(() => GangZoneEntity)
    gang_zone: GangZoneEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    //  ranks: Array<FactionRankEntity>;
    // inventory: InventoryItem[];
}
