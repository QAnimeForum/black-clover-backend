import {
    Entity,
    Column,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { StateFormEntity } from './state.form.entity';
import { BackgroundEnity } from '../../character/entity/background.entity';
import { SquadEntity } from '../../jobs/squards/entity/squad.entity';
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

    @OneToMany(() => BackgroundEnity, (background) => background.state)
    backgrounds: BackgroundEnity[];
    //  @OneToOne(() => StateFormEntity, (form) => form.state, { cascade: true })
    @ManyToOne(() => StateFormEntity, (stateForm) => stateForm.states)
    @JoinColumn({ name: 'form_id', referencedColumnName: 'id' })
    form: StateFormEntity;
    @OneToMany(() => ProvinceEntity, (province) => province.state)
    provinces: Array<ProvinceEntity>;
    @OneToMany(() => SquadEntity, (squad) => squad.state)
    squads: Array<SquadEntity>;
}
