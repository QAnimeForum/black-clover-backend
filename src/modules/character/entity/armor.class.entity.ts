import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
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


    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
