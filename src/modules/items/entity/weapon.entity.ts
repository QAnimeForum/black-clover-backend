import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    /*@ManyToMany(() => InventoryEntity, (inventory) => inventory.weapons)
    inventory: InventoryEntity;*/

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
