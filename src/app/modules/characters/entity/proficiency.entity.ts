import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
@Entity('proficiency')
export class ProficiencyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    level: number;

    @Column({
        type: 'int',
    })
    extraBonus: number;

    @OneToOne(() => CharacterCharacteristicsEntity)
    characterCharacteristics: CharacterCharacteristicsEntity;
}
