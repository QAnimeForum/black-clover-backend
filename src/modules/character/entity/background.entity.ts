import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { StateEntity } from '../../map/enitity/state.entity';
import { RaceEntity } from '../../race/entity/race.entity';
import { CharacterEntity } from './character.entity';

@Entity('background')
export class BackgroundEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @ManyToOne(() => RaceEntity, (race) => race.backgrounds)
    @JoinColumn({ name: 'race_id', referencedColumnName: 'id' })
    race: RaceEntity;

    @Column({
        type: 'int',
    })
    age: number;

    @Column({
        type: 'varchar',
    })
    sex: string;

    @Column({
        type: 'int',
    })
    height: number;

    @ManyToOne(() => StateEntity, (state) => state.backgrounds)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;
}
