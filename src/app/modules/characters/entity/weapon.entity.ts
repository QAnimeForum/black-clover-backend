import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { InventoryEntity } from './inventory.entity';

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
    inventory: InventoryEntity;
    //properties: string[];
    //fightingStyles?: string[];
}
