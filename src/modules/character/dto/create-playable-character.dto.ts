export class CreatePlayableCharacterDto {
    name: string;
    age: number;
    sex: string;
    raceId: string;
    stateId: string;
    magic: string;
    //  magicName: string;
    // userId: string;
    // age: number;
}

export class CharacterCharacteristicsDto {
    currentLevel: number;
    maxLevel: number;
    currentHealth: number;
    maxHealth: number;
}

/**
 * import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArmorEntity } from './armor.entity';

@Entity('armor_class')
export class ArmorClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column({
        type: 'int',
    })
    base: number;
    @Column({
        type: 'int',
    })
    modifier: number;
    @Column({
        type: 'int',
    })
    bonus: number;

    @OneToOne(() => ArmorEntity)
    armor: ArmorEntity;
}

 */
