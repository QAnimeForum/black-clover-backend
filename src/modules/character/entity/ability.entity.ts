import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
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

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    /*@ManyToOne(
        () => CharacterCharacteristicsEntity,
        (characterCharacteristics) => characterCharacteristics.speeds
    )
    @JoinColumn({ name: 'characteristics_id' })
    characterCharacteristics: CharacterCharacteristicsEntity;*/
}
