import { InventoryEntity } from '../../character/entity/inventory.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('armor')
export class ArmorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    armorType: string;
    @Column({
        type: 'varchar',
    })
    cost: string;

    /* @OneToOne(() => ArmorClassEntity)
    @JoinColumn()
    ac: ArmorClassEntity;*/
    //  modifier: Array<number>;
    @Column({
        type: 'int',
        name: 'ac_base',
    })
    acBase: number;
    //  modifier: Array<number>;
    @Column({
        type: 'int',
        name: 'ac_bonus',
    })
    acBonus: number;

    strengthPrerequisite: number;
    @Column({
        type: 'boolean',
    })
    stealthDisadvantage: boolean;
    @Column({
        type: 'varchar',
    })
    weight: string;

    @ManyToMany(() => InventoryEntity, (inventory) => inventory.armor)
    inventory: InventoryEntity;
    //  fightingStyles?: string[];

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
