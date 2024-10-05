import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ItemCategoryEntity } from './item.category.entity';
import { ENUM_ITEM_RARITY } from '../constants/item.entity.enum';
import { ENUM_BODY_PART_ENUM } from '../constants/body.part.enum';
import { InventoryEqipmentItemsEntity } from './inventory.eqipmentItems.entity';

@Entity('equpment_item')
export class EqupmentItemEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({
        length: 30,
        unique: true,
    })
    name: string;

    @ApiProperty()
    @Column({ type: 'text' })
    description: string;

    @ApiProperty()
    @Column({
        length: 40,
        nullable: true,
    })
    image: string;

    @ApiProperty({ type: () => ItemCategoryEntity })
    @ManyToOne((type) => ItemCategoryEntity, (category) => category.items, {
        eager: true,
    })
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'id',
    })
    category: ItemCategoryEntity;

    @Column({
        type: 'varchar',
        name: 'category_id',
    })
    categoryId: string;
    @ApiProperty({
        enum: ENUM_ITEM_RARITY,
    })
    @Column({
        type: 'enum',
        enum: ENUM_ITEM_RARITY,
        default: ENUM_ITEM_RARITY.COMMON,
    })
    rarity: ENUM_ITEM_RARITY;

    @Column({
        name: 'body_part',
        type: 'enum',
        enum: ENUM_BODY_PART_ENUM,
        default: ENUM_BODY_PART_ENUM.ACCESSORY,
    })
    bodyPart: ENUM_BODY_PART_ENUM;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    heal: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    strength: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    dexterity: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    vitality: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    intellect: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    luck: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    criticalChance: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    criticalDamage!: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    dodgeChance: number;

    @ApiProperty({ required: false })
    @Column({ name: 'map_health', default: 0 })
    mapHealth: number;
    @ApiProperty({ required: false })
    @Column({ name: 'max_magic_power', default: 0 })
    maxMagicPower: number;
    @ApiProperty({ required: false })
    @Column({ name: 'armor', default: 0 })
    armor: number;

    @ApiProperty({ required: false })
    @Column({ name: 'physical_attack_damage', default: 0 })
    physicalAttackDamage: number;
    @ApiProperty({ required: false })
    @Column({ name: 'magic_attack_damage', default: 0 })
    magicAttackDamage: number;

    @ApiProperty({ required: false })
    @Column({ name: 'inventory_pace', default: 0 })
    inventorySpace: number;

    @Column({ name: 'physical_defense', default: 0 })
    physicalDefense: number;

    @Column({ name: 'magic_defense', default: 0 })
    magicDefense: number;

    @Column({ name: 'accuracy_rate', default: 0 })
    accuracyRate: number;

    @Column({ name: 'evasion', default: 0 })
    evasion: number;

    @Column({ name: 'craft', default: 0 })
    craft: number;

    @Column({ name: 'speed', default: 0 })
    speed: number;

    @Column({ name: 'jump', default: 0 })
    jump: number;

    @OneToMany(() => InventoryEqipmentItemsEntity, (items) => items.inventory)
    inventoryEqipmentItems: InventoryEqipmentItemsEntity[];

    @ApiProperty()
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
