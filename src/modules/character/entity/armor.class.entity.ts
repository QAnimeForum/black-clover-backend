import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
import { ArmorEntity } from '../../jobs/business/entity/armor.entity';

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
