import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { InventoryEntity } from './inventory.entity';
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

    inventory: InventoryEntity;
}
