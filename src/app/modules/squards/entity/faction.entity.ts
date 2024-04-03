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
    members: any[];
    ranks: any[];
    inventory: InventoryItem[];
}

@Entity('member')
export class MemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    user: UserEntity;
    rank: RankEntity;
}

export type Permission =
    | 'warehouse'
    | 'inventory'
    | 'garage'
    | 'workshop'
    | 'leader'
    | 'members'
    | 'wanted';

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

    @Column({
        type: 'varchar',
    })
    permissions: string[];
}

@Entity('gang_zone')
export class GangZoneEntity {
    owner: FactionEntity;
    position: PositionEx;
    capturedAt: string;
}