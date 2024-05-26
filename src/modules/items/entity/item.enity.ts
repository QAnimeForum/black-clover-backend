import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ItemCategoryEntity } from './item.category.entity';
import { ENUM_ITEM_RARITY } from '../constants/item.entity.enum';

@Entity('Item')
export class ItemEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

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
    category: ItemCategoryEntity;

    @ApiProperty({
        enum: ENUM_ITEM_RARITY,
    })
    @Column({
        type: 'enum',
        enum: ENUM_ITEM_RARITY,
        default: ENUM_ITEM_RARITY.COMMON,
    })
    rarity: ENUM_ITEM_RARITY;

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
    criticalChance: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    criticalDamage!: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    dodgeChance: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    health: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    mana: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    armor: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    damage: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    goldDropMod!: number;

    @ApiProperty({ required: false })
    @Column({ default: 0 })
    inventorySpace: number;
    @ApiProperty()
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
