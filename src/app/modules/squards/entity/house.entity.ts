import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterEntity } from '../../characters/entity/character.entity';

@Entity('house')
export class HouseEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    type: string;

    @Column({
        type: 'boolean',
    })
    locked: boolean;
    @Column({
        type: 'int',
    })
    paid: number;

    owner: CharacterEntity;
}
