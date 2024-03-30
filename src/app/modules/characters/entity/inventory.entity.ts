import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { ItemEnity } from './item.entity';
import { ArmorEntity } from '../../business/entity/armor.entity';
import { WeaponEntity } from '../../business/entity/weapon.entity';
import { ToolKitEnity } from './toolkit.entity';
import { WalletEntity } from './wallet.entity';
@Entity('inventory')
export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    /**
     * оружие
     */
    @OneToMany(() => WeaponEntity, (weapon) => weapon.inventory)
    weapons: WeaponEntity[];
    /**
     * броня
     */
    @OneToMany(() => ArmorEntity, (armor) => armor.inventory)
    armor: ArmorEntity[];
    /**инструмент */
    @OneToMany(() => ToolKitEnity, (toolKit) => toolKit.inventory)
    toolKits: ToolKitEnity[];
    /**
     * механизм
     */
    @OneToMany(() => ItemEnity, (item) => item.inventory)
    gear: ItemEnity[];

    @OneToOne(() => WalletEntity)
    @JoinColumn()
    wallet: WalletEntity;
}
