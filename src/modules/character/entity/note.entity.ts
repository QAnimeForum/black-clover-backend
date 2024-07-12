import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
