import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RestaurantMenuEntity } from './restaurant.menu.entity';
import { DrinkEntity } from './drink.entity';

@Entity('restaurant_drinks')
export class RestaurantDrinksEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => RestaurantMenuEntity, (menu) => menu.drinks)
    @JoinColumn({
        name: 'menu_id',
        referencedColumnName: 'id',
    })
    menu: RestaurantMenuEntity;

    @Column({
        type: 'uuid',
        name: 'menu_id',
    })
    menuId: string;

    @ManyToOne(() => DrinkEntity, (drink) => drink.restaurantDrinks)
    @JoinColumn({
        name: 'drink_id',
        referencedColumnName: 'id',
    })
    drink: DrinkEntity;

    @Column({
        type: 'uuid',
        name: 'drink_id',
    })
    drinkId: string;

    @Column({
        type: 'int',
    })
    copper: number;
    @Column({
        type: 'int',
    })
    silver: number;
    @Column({
        type: 'int',
    })
    electrum: number;
    @Column({
        type: 'int',
    })
    gold: number;
    @Column({
        type: 'int',
    })
    platinum: number;


    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
