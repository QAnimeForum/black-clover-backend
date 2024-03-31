import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { InventoryEntity } from './inventory.entity';

@Entity('toolKit')
export class ToolKitEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    kit: string;
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
}
