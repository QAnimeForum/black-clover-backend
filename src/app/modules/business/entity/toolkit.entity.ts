import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { InventoryEntity } from '../../characters/entity/inventory.entity';

@Entity('toolKit')
export class ToolKitEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    kit: string;
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
