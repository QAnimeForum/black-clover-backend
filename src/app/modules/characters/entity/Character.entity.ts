import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterType } from '../constants/character.type.enum';
import { BackgroundEnity } from './background.entity';
import { CharacterCharacteristicsEntity } from './character.characteristics.entity';
import { InventoryEntity } from './inventory.entity';
import { GrimoireEntity } from './grimoire.entity';

@Entity('character')
export class CharacterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: CharacterType,
        default: CharacterType.PC,
    })
    type: CharacterType;

    @OneToOne(() => BackgroundEnity)
    @JoinColumn({
        name: 'background_id',
    })
    background: BackgroundEnity;

    @OneToOne(() => CharacterCharacteristicsEntity)
    @JoinColumn({
        name: 'characteristics_id',
        referencedColumnName: 'id',
    })
    characterCharacteristics: CharacterCharacteristicsEntity;

    @OneToOne(() => GrimoireEntity)
    @JoinColumn({
        name: 'grimoire_id',
        referencedColumnName: 'id',
    })
    grimoire: GrimoireEntity;

    @OneToMany(() => NoteEntity, (note) => note.character)
    notes: NoteEntity[];

    @OneToOne(() => InventoryEntity)
    @JoinColumn({
        name: 'inventory_id',
        referencedColumnName: 'id',
    })
    inventory: InventoryEntity;
}

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
    character: CharacterEntity;
}

/**
 *     id: string;
    type: CharacterType;
    background: Background;
    characteristics: CharacterCharacteristics;
    grimoire: Grimoire;
    notes: Note[];
    inventory: Inventory;
 */
