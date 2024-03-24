import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProvinceEnity } from './province.entity';

@Entity('burg')
export class BurgEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;

    @ManyToOne(() => ProvinceEnity, (province) => province.burgs)
    province: ProvinceEnity;

    /**
    *  @OneToOne(() => StateEntity, (state) => state.capital) // specify inverse side as a second parameter
    capital: StateEntity;
    */
}
