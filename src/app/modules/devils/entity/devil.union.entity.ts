import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DevilSpellEntity } from './devil.spell.entity';

@Entity('devil_union')
export class DevilUnionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => DevilSpellEntity, (devilSpell) => devilSpell.union)
    spells: Array<DevilSpellEntity>;
}
