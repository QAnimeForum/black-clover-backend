import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DrinkEntity } from './drink.entity';

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
  /**
   *   @Column({
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

   */

    @OneToMany(() => DrinkEntity, (drink) => drink.type)
    drinks: DrinkEntity[];
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
