import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { InventoryEntity } from '../../../character/entity/inventory.entity';
@Entity('gear')
export class GearEnity {
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

    @ManyToMany(() => InventoryEntity, (inventory) => inventory.gears)
    inventory: InventoryEntity;
}
