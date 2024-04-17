import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => CharacterEntity, (character) => character.tasks)
    characters: Array<CharacterEntity>;
}
