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
import { ResourceEntity } from './resource.entity';
@Entity('resurce_category')
@Tree('closure-table')
export class ResourceCategoryEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    parentId: string;

    // @ManyToOne((type) => ItemCategoryEntity, (category) => category.children)

    @TreeParent()
    parent: ResourceCategoryEntity;

    @ApiProperty()
    @Column({
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
    children: ResourceCategoryEntity[];

    @OneToMany((type) => ResourceEntity, (item) => item.category)
    items: ResourceEntity[];
}
