import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProvinceEnity } from './province.entity';
import { StateFormEntity } from './state.form.entity';

@Entity('state')
export class StateEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    fullName: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    /**
  *    @OneToOne(() => BurgEntity, (burg) => burg.state) // specify inverse side as a second parameter
    @JoinColumn()
    capital: Burg;

  */

    @OneToOne(() => StateFormEntity, (form) => form.state)
    @JoinColumn()
    form: StateFormEntity;
    @OneToMany(() => ProvinceEnity, (province) => province.state)
    provinces: Array<ProvinceEnity>;
}
