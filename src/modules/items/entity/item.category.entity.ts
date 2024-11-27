import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { EqupmentItemEntity } from './equpment.item.entity';
@Entity('item_category')
@Tree('closure-table')
export class ItemCategoryEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    parentId: string;

    // @ManyToOne((type) => ItemCategoryEntity, (category) => category.children)

    @TreeParent()
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

    // @OneToMany((type) => ItemCategoryEntity, (category) => category.parent)
    @TreeChildren()
    children: ItemCategoryEntity[];

    @OneToMany((type) => EqupmentItemEntity, (item) => item.category)
    items: EqupmentItemEntity[];
}
