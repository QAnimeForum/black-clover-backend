import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { InventoryEntity } from './inventory.entity';
import { DrinkEntity } from '../../cuisine/entities/drink.entity';

@Entity('drink_inventory')
export class DrinkInventoryEntity {
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

    @ManyToOne(() => DrinkEntity, (item) => item.restaurantDrinks)
    @JoinColumn({ name: 'drink_id', referencedColumnName: 'id' })
    public drink: DrinkEntity;

    /**
     * количество воды в литрах
     */
    @Column({
        type: 'varchar',
        name: 'count',
    })
    public count: number;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
