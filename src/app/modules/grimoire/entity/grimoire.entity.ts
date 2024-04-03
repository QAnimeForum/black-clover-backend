import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CardSymbolsEnum } from '../../character/constants/card.symbol.enum';
import { SpellEntity } from './spell.entity';
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
        enum: CardSymbolsEnum,
        default: CardSymbolsEnum.CLOVER,
    })
    coverSymbol: CardSymbolsEnum;

    @Column({
        type: 'varchar',
    })
    magicColor: string;

    @OneToMany(() => SpellEntity, (spell) => spell.grimoire)
    spells: Array<SpellEntity>;
}
