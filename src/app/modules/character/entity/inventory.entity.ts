import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { WeaponEntity } from '../../jobs/business/entity/weapon.entity';
import { ArmorEntity } from '../../jobs/business/entity/armor.entity';
import { ToolKitEnity } from '../../jobs/business/entity/toolkit.entity';
import { VehicleEntity } from '../../jobs/business/entity/vehicle.entity';
import { GearEnity } from '../../jobs/business/entity/gear.entity';
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
    @ManyToMany(() => GearEnity)
    @JoinTable()
    gears: GearEnity[];

    @ManyToMany(() => VehicleEntity)
    @JoinTable()
    vehicles: Array<VehicleEntity>;
}
