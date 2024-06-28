import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('spell_requirements')
export class SpellRequirementsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    minimalLevel: number;

    @Column('text', { name: 'magic_atribbutes', array: true })
    magicalAttributes: string[];
}
