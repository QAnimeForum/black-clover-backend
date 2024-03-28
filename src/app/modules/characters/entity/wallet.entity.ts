import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { InventoryEntity } from './inventory.entity';

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'int',
    })
    cooper: number;
    @Column({
        type: 'int',
    })
    silver: number;
    @Column({
        type: 'int',
    })
    eclevtrum: number;
    @Column({
        type: 'int',
    })
    gold: number;
    @Column({
        type: 'int',
    })
    platinum: number;

    @OneToOne(() => InventoryEntity)
    inventory: InventoryEntity;
}
