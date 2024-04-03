import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../characters/entity/character.entity';
import { InventoryEntity } from '../../characters/entity/inventory.entity';

@Entity('vehicle')
export class VehicleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    owner: CharacterEntity;

    oldOwners: Array<CharacterEntity>;

    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    govNumber: string;
    @Column({
        type: 'int',
    })
    fuel: number;
    @Column({
        type: 'int',
    })
    state: number;
    @Column({
        type: 'varchar',
    })
    tuning: string;
    @ManyToOne(() => InventoryEntity, (inventory) => inventory.vehicles)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    inventory: InventoryEntity;
}
