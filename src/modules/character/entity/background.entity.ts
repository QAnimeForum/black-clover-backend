import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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
        type: 'varchar',
    })
    history: string;

    @Column({
        type: 'varchar',
    })
    appearance: string;

    @ManyToOne(() => StateEntity, (state) => state.backgrounds)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
