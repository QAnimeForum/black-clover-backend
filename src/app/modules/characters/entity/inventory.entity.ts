import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ItemEnity } from '../../business/entity/item.entity';
import { ArmorEntity } from '../../business/entity/armor.entity';
import { WeaponEntity } from '../../business/entity/weapon.entity';
import { ToolKitEnity } from '../../business/entity/toolkit.entity';
import { VehicleEntity } from '../../business/entity/vehicle.entity';
@Entity('inventory')
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    /**
     * оружие
     */
    @ManyToMany(() => WeaponEntity)
    @JoinTable()
    weapons: WeaponEntity[];
    /**
     * броня
     */
    @ManyToMany(() => ArmorEntity)
    @JoinTable()
    armor: ArmorEntity[];
    /**инструмент */
    @ManyToMany(() => ToolKitEnity)
    @JoinTable()
    toolKits: ToolKitEnity[];
    /**
     * механизм
     */
    @ManyToMany(() => ItemEnity)
    @JoinTable()
    gear: ItemEnity[];

    @ManyToMany(() => VehicleEntity)
    @JoinTable()
    vehicles: Array<VehicleEntity>;
}
