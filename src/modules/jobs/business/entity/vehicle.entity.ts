import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryEntity } from '../../../character/entity/inventory.entity';

@Entity('vehicle')
export class VehicleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //   owner: CharacterEntity;

    //  oldOwners: Array<CharacterEntity>;

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
    @ManyToMany(() => InventoryEntity, (inventory) => inventory.vehicles)
    inventory: InventoryEntity;
}
