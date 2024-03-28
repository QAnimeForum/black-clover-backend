import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from '../../characters/entity/character.entity';

@Entity('user')
export class UserEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    telegram_id: number;

    @OneToOne(() => CharacterEntity, (character) => character.user)
    @JoinColumn({
        name: 'character_id',
    })
    character: CharacterEntity;
}
