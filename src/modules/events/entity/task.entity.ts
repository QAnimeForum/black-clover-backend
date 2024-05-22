import {
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CharacterEntity } from '../../character/entity/character.entity';

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => CharacterEntity, (character) => character.tasks)
    characters: Array<CharacterEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
