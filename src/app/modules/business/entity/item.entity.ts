import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { InventoryEntity } from '../../characters/entity/inventory.entity';
@Entity('item')
export class ItemEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    itemType: string;

    @Column({
        type: 'int',
    })
    quantity: number;
    @Column({
        type: 'varchar',
    })
    cost: string;
    @Column({
        type: 'varchar',
    })
    weight: string;
    @Column({
        type: 'varchar',
    })
    description: string;

    @ManyToOne(() => InventoryEntity, (inventory) => inventory.weapons)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    inventory: InventoryEntity;
}
