import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
@Entity('speed')
export class SpeedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'int',
    })
    base: number;
    @Column({
        type: 'int',
    })
    bonus: number;

    @ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    @JoinColumn({
        name: 'character_characteristics_id',
        referencedColumnName: 'id',
    })
    characterCharacteristics: CharacterCharacteristicsEntity;
}
