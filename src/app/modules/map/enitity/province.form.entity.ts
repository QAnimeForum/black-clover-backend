import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProvinceEnity } from './province.entity';

@Entity('province_form')
export class ProvinceFormEntity {
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

    @OneToOne(() => ProvinceEnity, (province) => province.form)
    province: ProvinceEnity;
}
