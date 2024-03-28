import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from 'typeorm';
import { InventoryEntity } from './inventory.entity';
import { ArmorClassEntity } from './character.characteristics.entity';

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

    @OneToOne(() => ArmorClassEntity)
    @JoinColumn()
    ac: ArmorClassEntity;

    @Column({
        type: 'int',
    })
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
    inventory: InventoryEntity;
    //  fightingStyles?: string[];
}
