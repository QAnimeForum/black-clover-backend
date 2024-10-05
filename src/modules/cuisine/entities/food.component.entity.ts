import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('food_component')
export default class FoodComponentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;

    @Column('varchar', { name: 'flavors', array: true })
    flavors: string[];
    @Column('varchar', { name: 'textures', array: true })
    textures: string[];
    @Column('varchar', { name: 'colors', array: true })
    colors: string[];

    @Column({
        type: 'varchar',
    })
    category: string;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
