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
export class BackgroundEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;


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
        nullable: true,
    })
    hobbies: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    goals: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    worldview: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    characterTraits: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    ideals: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    attachments: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    weaknesses: string;
    @Column({ name: 'quotes', type: 'varchar', array: true, nullable: true })
    quotes: string[];
    @Column({
        type: 'varchar',
    })
    appearance: string;

    @ManyToOne(() => RaceEntity, (race) => race.backgrounds)
    @JoinColumn({ name: 'race_id', referencedColumnName: 'id' })
    race: RaceEntity;

    @Column({
        name: 'race_id',
        type: 'string',
    })
    raceId: string;

    @ManyToOne(() => StateEntity, (state) => state.backgrounds)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state: StateEntity;

    @Column({
        name: 'state_id',
        type: 'string',
    })
    stateId: string;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
