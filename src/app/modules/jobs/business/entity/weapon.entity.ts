import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { InventoryEntity } from '../../../character/entity/inventory.entity';
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

    @ManyToMany(() => InventoryEntity, (inventory) => inventory.weapons)
    inventory: InventoryEntity;
    //properties: string[];
    //fightingStyles?: string[];
}
