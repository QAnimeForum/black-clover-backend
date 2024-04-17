import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { SpellEntity } from './spell.entity';
import { ENUM_GRIMOIRE_SYMBOL } from '../constants/grimoire.symbol.enum';
import { ManaZoneEntity } from './mana.zone.entity';
import { ManaSkinEntity } from './mana.skin.entity';
import { CharacterEntity } from '../../character/entity/character.entity';

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

    @OneToOne(() => ManaSkinEntity)
    @JoinColumn({
        name: 'mana_skin_id',
        referencedColumnName: 'id',
    })
    manaSkin: ManaSkinEntity;
    @OneToOne(() => ManaZoneEntity)
    @JoinColumn({
        name: 'mana_zone',
        referencedColumnName: 'id',
    })
    manaZone: ManaZoneEntity;
    @OneToMany(() => SpellEntity, (spell) => spell.grimoire)
    spells: Array<SpellEntity>;

    @OneToOne(() => CharacterEntity)
    character: CharacterEntity;
}
