import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SpellEntity } from './spell.entity';
import { ENUM_GRIMOIRE_SYMBOL } from '../constants/grimoire.symbol.enum';

@Entity('grimoire')
export class GrimoireEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    magicName: string;

    @Column({
        type: 'enum',
        enum: ENUM_GRIMOIRE_SYMBOL,
        default: ENUM_GRIMOIRE_SYMBOL.CLOVER,
    })
    coverSymbol: ENUM_GRIMOIRE_SYMBOL;

    @Column({
        type: 'varchar',
    })
    magicColor: string;

    @OneToMany(() => SpellEntity, (spell) => spell.grimoire)
    spells: Array<SpellEntity>;
}
