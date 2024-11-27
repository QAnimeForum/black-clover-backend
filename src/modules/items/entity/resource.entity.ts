import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ResourceCategoryEntity } from './resource.category.entity';

@Entity('resource')
export class ResourceEntity {
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

    @Column({ type: 'boolean' })
    edible: boolean;

    @Column({ type: 'varchar' })
    image: string;
    @ApiProperty({ type: () => ResourceCategoryEntity })
    @ManyToOne((type) => ResourceCategoryEntity, (category) => category.items, {
        eager: true,
    })
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'id',
    })
    category: ResourceCategoryEntity;

    @Column({
        type: 'varchar',
        name: 'category_id',
    })
    categoryId: string;
    @ApiProperty()
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
