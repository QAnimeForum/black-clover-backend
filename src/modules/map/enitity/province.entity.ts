import {
    Entity,
    Column,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
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

    @Column({
        type: 'varchar',
    })
    image: string;

    @ManyToOne(() => StateEntity, (state) => state.provinces)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @ManyToOne(() => ProvinceFormEntity, (form) => form.provinces)
    @JoinColumn({ name: 'form_id', referencedColumnName: 'id' })
    form: ProvinceFormEntity;

    @OneToMany(() => BurgEntity, (burg) => burg.province)
    burgs: Array<BurgEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

}
