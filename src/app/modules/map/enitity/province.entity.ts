import {
    Entity,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import { StateEntity } from './state.entity';
import { BurgEntity } from './burg.entity';
import { ProvinceFormEntity } from './province.form.entity';

@Entity('province')
export class ProvinceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
        name: 'short_name',
    })
    shortName: string;
    @Column({
        type: 'varchar',
        name: 'full_name',
    })
    fullName: string;

    @ManyToOne(() => StateEntity, (state) => state.provinces)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @ManyToOne(() => ProvinceFormEntity, (form) => form.provinces)
    @JoinColumn({ name: 'form_id', referencedColumnName: 'id' })
    form: ProvinceFormEntity;

    @OneToMany(() => BurgEntity, (burg) => burg.province)
    burgs: Array<BurgEntity>;
}
