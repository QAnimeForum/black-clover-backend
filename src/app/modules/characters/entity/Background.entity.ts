import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { StateEntity } from '../../map/enitity/state.entity';
import { RaceEntity } from './race.entity';
import { CharacterEntity } from './character.entity';

@Entity('background')
export class BackgroundEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToOne(() => RaceEntity, (race) => race.background)
    @JoinColumn({ name: 'race_id', referencedColumnName: 'id' })
    race: RaceEntity;

    @Column({
        type: 'int',
    })
    age: number;

    @Column({
        type: 'int',
    })
    height: number;

    @OneToOne(() => StateEntity, (state) => state.background)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;
}
