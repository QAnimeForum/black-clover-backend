import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArmorEntity } from '../../business/entity/armor.entity';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';

@Entity('armor_class')
export class ArmorClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'int',
    })
    base: number;
    //  modifier: Array<number>;
    @Column({
        type: 'int',
    })
    bonus: number;
    @OneToOne(() => CharacterCharacteristicsEntity)
    characterCharacteristics: CharacterCharacteristicsEntity;
    @OneToOne(() => ArmorEntity)
    armor: ArmorEntity;
}
