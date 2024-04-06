import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
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
    //  ranks: Array<FactionRankEntity>;
    // inventory: InventoryItem[];
}
