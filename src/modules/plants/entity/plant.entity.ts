import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('plant')
export class PlantEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        name: 'emoji_icon',
        type: 'varchar',
    })
    emojiIcon: string;

    @Column()
    description: string;

    @Column({
        name: 'cost_money',
        type: 'int',
    })
    costMoney: number;

    @Column({
        name: 'watering_interval',
        type: 'int',
    })
    wateringInterval: number;

    @Column({
        name: 'sale_price',
        type: 'int',
    })
    salePrice: number;

    @Column({
        name: 'death_time',
        type: 'int',
    })
    deathTime: number;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
