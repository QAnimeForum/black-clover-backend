import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @ManyToOne(() => ProvinceEntity, (province) => province.burgs)
    province: ProvinceEntity;

    /**
    *  @OneToOne(() => StateEntity, (state) => state.capital) // specify inverse side as a second parameter
    capital: StateEntity;
    */
}
