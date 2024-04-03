import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { InventoryEntity } from '../../characters/entity/inventory.entity';

@Entity('weapons')
export class WeaponEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    weaponType: string;
    @Column({
        type: 'varchar',
    })
    cost: string;
    @Column({
        type: 'varchar',
    })
    damage: string;
    @Column({
        type: 'varchar',
    })
    damageType: string;
    @Column({
        type: 'varchar',
    })
    weight: string;

    @ManyToOne(() => InventoryEntity, (inventory) => inventory.weapons)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    inventory: InventoryEntity;
    //properties: string[];
    //fightingStyles?: string[];
}
