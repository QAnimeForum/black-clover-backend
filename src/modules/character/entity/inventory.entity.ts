import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WeaponEntity } from '../../business/entity/weapon.entity';
import { ArmorEntity } from '../../business/entity/armor.entity';
import { ToolKitEnity } from '../../business/entity/toolkit.entity';
import { VehicleEntity } from '../../business/entity/vehicle.entity';
import { GearEntity } from '../../business/entity/gear.entity';
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
    @ManyToMany(() => GearEntity)
    @JoinTable()
    gears: GearEntity[];

    @ManyToMany(() => VehicleEntity)
    @JoinTable()
    vehicles: Array<VehicleEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
