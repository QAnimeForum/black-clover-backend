import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentEntity } from './equipment.entity';

@Entity('shop')
export class ShopEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => EquipmentEntity)
    @JoinColumn({
        name: 'item_id',
        referencedColumnName: 'id',
    })
    item: EquipmentEntity;
    @Column({
        name: 'item_id',
        type: 'uuid',
    })
    item_id: string;

    @Column({
        name: 'is_active',
        type: 'bool',
    })
    isActvie: boolean;

    price: number;
}
