import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterEntity } from './character.entity';

@Entity('note')
export class NoteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    title: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'varchar',
    })
    date: string;

    @ManyToOne(() => CharacterEntity, (character) => character.notes)
    @JoinColumn({ name: 'character_id', referencedColumnName: 'id' })
    character: CharacterEntity;
}
