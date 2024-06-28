import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BackgroundEntity } from '../../character/entity/background.entity';
@Entity('race')
export class RaceEntity {
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
        type: 'int',
        name: 'bonus_hp',
    })
    bonusHp: number;

    @Column({
        type: 'int',
        name: 'bonus_magic_power',
    })
    bonusMagicPower: number;

    @Column({
        type: 'bool',
        name: 'natural_mana',
    })
    naturalMana: boolean;
   /**
    *  @Column({
        type: 'boolean',
        name: 'increased_endurance',
    })
    increasedEndurance: boolean;
    */
    
    @OneToMany(() => BackgroundEntity, (background) => background.race)
    backgrounds: BackgroundEntity[];

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
