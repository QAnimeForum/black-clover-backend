import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('cuisine')
export default class CuisineEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    commonDishes: string[];
    commonSeasonings: string[];
    commonVegetables: string[];
    commonMainComponents: string[];
    commonCookingMethods: string[];
    commonDrinks: string[];

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
