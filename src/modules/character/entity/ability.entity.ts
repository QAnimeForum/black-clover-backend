import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('ability')
export class AbilityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    /*@Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    abbr: string;*/
    @Column({
        type: 'int',
    })
    score: number;

    @Column({
        type: 'int',
    })
    modifier: number;

    /*@ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    @JoinColumn({ name: 'characteristics_id' })
    characterCharacteristics: CharacterCharacteristicsEntity;*/
}
