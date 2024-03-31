import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
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

    @OneToOne(() => WalletEntity)
    @JoinColumn()
    wallet: WalletEntity;
}
