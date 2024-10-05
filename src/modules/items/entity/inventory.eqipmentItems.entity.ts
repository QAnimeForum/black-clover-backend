import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationCount,
} from 'typeorm';
import { EqupmentItemEntity } from './equpment.item.entity';
import { InventoryEntity } from './inventory.entity';

@Entity('inventory_equipment_items')
export class InventoryEqipmentItemsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(
        () => InventoryEntity,
        (inventory) => inventory.inventoryEqipmentItems
    )
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    public inventory: InventoryEntity;

    @Column({
        type: 'varchar',
        name: 'inventory_id',
    })
    public invetoryId: string;

    @ManyToOne(() => EqupmentItemEntity, (item) => item.inventoryEqipmentItems)
    @JoinColumn({ name: 'equpment_item_id', referencedColumnName: 'id' })
    public equpmentItem: EqupmentItemEntity;

    @Column({
        type: 'varchar',
        name: 'equpment_item_id',
    })
    public equpmentItemId: string;
    
}
