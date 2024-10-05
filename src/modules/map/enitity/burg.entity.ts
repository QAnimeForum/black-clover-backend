import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';

@Entity('burg')
export class BurgEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'varchar',
    })
    image: string;

    @ManyToOne(() => ProvinceEntity, (province) => province.burgs)
    @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
    province: ProvinceEntity;

    @Column({
        name: 'province_id',
        type: 'varchar',
        nullable: true,
    })
    provinceId: string;

    @Column({
        name: 'is_captial',
        type: 'boolean',
        default: false,
    })
    isCaptial: boolean;

    @Column({
        name: 'has_port',
        type: 'boolean',
        default: false,
    })
    hasPort: boolean;

    
    @Column({
        name: 'has_walls',
        type: 'boolean',
        default: false,
    })
    hasWalls: boolean;

    @Column({
        name: 'has_shopping_area',
        type: 'boolean',
        default: false,
    })
    hasShoppingArea: boolean;


    @Column({
        name: 'has_slum',
        type: 'boolean',
        default: false,
    })
    hasSlum: boolean;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    /**
    *  @OneToOne(() => StateEntity, (state) => state.capital) // specify inverse side as a second parameter
    capital: StateEntity;
    */
}
