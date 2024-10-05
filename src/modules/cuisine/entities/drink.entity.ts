import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import DrinkType from './drink.type.entity';


export enum ENUM_DRINK_QUALITY {
    NASTY,
    AWFUL,
    ACCEPTABLE,
    DECENT,
    GOOD,
    EXCELLENT,
}

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
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}


/**
 *    @OneToOne(() => MoneyEntity)
    @JoinColumn({
        name: 'price_id',
        referencedColumnName: 'id',
    })
    cost: MoneyEntity;
 */