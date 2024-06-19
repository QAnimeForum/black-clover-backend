import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ToolKitEnity } from '../../items/entity/toolkit.entity';
import { VehicleEntity } from '../../items/entity/vehicle.entity';
import { GearEntity } from '../../items/entity/gear.entity';
import { DrinkEntity } from '../../cuisine/entities/drink.entity';
import { EquipmentEntity } from './equipment.entity';
import { EqupmentItemEntity } from './equpment.item.entity';
@Entity('inventory')
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
    *  @ManyToMany(() => ItemEntity)
    @JoinTable()
    helmets: ItemEntity[];

    @ManyToMany(() => ItemEntity)
    @JoinTable()
    weapons: ItemEntity[];
  
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    armors: ItemEntity[];

    @ManyToMany(() => ItemEntity)
    @JoinTable()
    cloaks: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    hairs: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    face: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    eyes: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    ears: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    clothes: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    pants: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    gloves: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    shields: ItemEntity[];
    @ManyToMany(() => ItemEntity)
    @JoinTable()
    
    */

    @ManyToMany(() => EqupmentItemEntity)
    @JoinTable({
        name: 'inventory_eqipment_items',
    })
    items: EqupmentItemEntity[];

    @ManyToMany(() => DrinkEntity)
    @JoinTable({ name: 'inventory_drinks' })
    drink: DrinkEntity[];

    @ManyToMany(() => ToolKitEnity)
    @JoinTable({
        name: 'intentory_toolkit',
    })
    toolKits: ToolKitEnity[];
    /**
     * механизм
     */
    @ManyToMany(() => GearEntity)
    @JoinTable({
        name: 'inventory_gears',
    })
    gears: GearEntity[];

    @ManyToMany(() => VehicleEntity)
    @JoinTable({
        name: 'inventory_vehicles',
    })
    vehicles: Array<VehicleEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
