import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RestaurantDrinksEntity } from './restaurant.drinks.entity';
import { DrinkInventoryEntity } from '../../items/entity/drink.inventory.entity';

@Entity('drink')
export class DrinkEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        name: 'image_path',
        type: 'varchar',
    })
    imagePath: string;

    @Column({
        type: 'varchar',
    })
    description: string;
    @Column({
        type: 'varchar',
    })
    appearance: string;

    @OneToMany(() => RestaurantDrinksEntity, (item) => item.drink)
    restaurantDrinks: RestaurantDrinksEntity[];

    @OneToMany(() => DrinkInventoryEntity, (item) => item.drink)
    inventorySlots: DrinkInventoryEntity[];

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}

/**
 * 
 * 
 * 
export enum ENUM_DRINK_QUALITY {
    NASTY,
    AWFUL,
    ACCEPTABLE,
    DECENT,
    GOOD,
    EXCELLENT,
}
    @Column({
        type: 'enum',
        enum: ENUM_DRINK_QUALITY,
        default: ENUM_DRINK_QUALITY.AWFUL,
    })
    quality: ENUM_DRINK_QUALITY;

    @ManyToOne(() => DrinkType, (drinkType) => drinkType.drinks)
    @JoinColumn({
        name: 'type_id',
        referencedColumnName: 'id',
    })
    type: DrinkType;

    @Column({
        type: 'uuid',
        name: 'type_id',
    })
    typeId: string;
 */
/**
 *    @OneToOne(() => MoneyEntity)
    @JoinColumn({
        name: 'price_id',
        referencedColumnName: 'id',
    })
    cost: MoneyEntity;
 */
 
    /*
    @Entity('drink_type')
    export default class DrinkTypeEntity {
        @PrimaryGeneratedColumn('uuid')
        id: string;
        @Column({
            type: 'varchar',
        })
        name: string;
    
        @Column({
            type: 'varchar',
        })
        drinkImage: string;
        @Column({
            type: 'varchar',
        })
        strengthMin: number;
        @Column({
            type: 'varchar',
        })
        strengthMax: number;
        @Column({
            type: 'varchar',
        })
        costMin: number;
        @Column({
            type: 'varchar',
        })
        costMax: number;
        @Column('varchar', { name: 'colors', array: true })
        appearances: string[];
    
    
    
        @OneToMany(() => DrinkEntity, (drink) => drink.type)
        drinks: DrinkEntity[];
        @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
        createdAt: Date;
    
        @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
        updatedAt: Date;
    }
    */