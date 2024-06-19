import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import DrinkType from './drink.type.entity';
import { MoneyEntity } from '../../money/entity/money.entity';

@Entity('drink')
export class DrinkEntity {
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
    appearance: string;
    @Column({
        type: 'int',
    })
    quality: number;
    @Column({
        type: 'int',
    })
    strength: number;
    @OneToOne(() => MoneyEntity)
    @JoinColumn({
        name: 'price_id',
        referencedColumnName: 'id',
    })
    cost: MoneyEntity;

    @ManyToOne(() => DrinkType, (drinkType) => drinkType.drinks)
    @JoinColumn({
        name: 'drink_id',
        referencedColumnName: 'id',
    })
    type: DrinkType;

    @Column({
        type: 'uuid',
        name: 'drink_id',
    })
    typeId: string;
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
