import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentEntity } from './equipment.entity';
import { EqupmentItemEntity } from './equpment.item.entity';

@Entity('shop')
export class ShopEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'item_id',
        referencedColumnName: 'id',
    })
    item: EqupmentItemEntity;
    @Column({
        name: 'item_id',
        type: 'uuid',
    })
    itemId: string;

    @Column({
        name: 'is_active',
        type: 'bool',
    })
    isActvie: boolean;

    @Column({
        name: 'copper',
        type: 'int',
    })
    copper: number;

    @Column({
        name: 'silver',
        type: 'int',
    })
    silver: number;

    @Column({
        name: 'gold',
        type: 'int',
    })
    gold: number;

    @Column({
        name: 'electrum',
        type: 'int',
    })
    electrum: number;

    @Column({
        name: 'platinum',
        type: 'int',
    })
    platinum: number;
}
