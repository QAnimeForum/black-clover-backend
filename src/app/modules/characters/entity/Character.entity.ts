import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('character')
export class CharacterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
}
