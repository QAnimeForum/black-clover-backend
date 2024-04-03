import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { InventoryEntity } from '../../characters/entity/inventory.entity';
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

    @ManyToOne(() => InventoryEntity, (inventory) => inventory.weapons)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    inventory: InventoryEntity;
    //  fightingStyles?: string[];
}
