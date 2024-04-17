import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProvinceEntity } from './province.entity';

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

    @OneToMany(() => ProvinceEntity, (province) => province.form)
    provinces: Array<ProvinceEntity>;
}
