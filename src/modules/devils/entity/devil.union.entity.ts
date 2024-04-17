import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DevilUnionsPercentEnum } from '../constants/devil.union.percent.enum';
import { DevilSpellEntity } from './devil.spell.entity';

@Entity('devil_union')
export class DevilUnionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: DevilUnionsPercentEnum,
        default: DevilUnionsPercentEnum.PERCENT_10,
    })
    percent: DevilUnionsPercentEnum;

    @OneToMany(() => DevilSpellEntity, (devilSpell) => devilSpell.union)
    spells: Array<DevilSpellEntity>;
}
