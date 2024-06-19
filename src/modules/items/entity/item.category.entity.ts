import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentEntity } from './equipment.entity';
import { EqupmentItemEntity } from './equpment.item.entity';
@Entity('item_category')
export class ItemCategoryEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    parentId: number;

    @ManyToOne((type) => ItemCategoryEntity, (category) => category.children)
    parent: ItemCategoryEntity;

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
    @CreateDateColumn()
    createdAt: Date;

    @OneToMany((type) => ItemCategoryEntity, (category) => category.parent)
    children: ItemCategoryEntity[];

    @OneToMany((type) => EqupmentItemEntity, (item) => item.category)
    items: EqupmentItemEntity[];
}
