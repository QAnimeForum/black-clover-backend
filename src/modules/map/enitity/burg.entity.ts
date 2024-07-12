import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
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
    province: ProvinceEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    /**
    *  @OneToOne(() => StateEntity, (state) => state.capital) // specify inverse side as a second parameter
    capital: StateEntity;
    */
}
