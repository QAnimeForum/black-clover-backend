import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DevilUnionsPercentEnum } from '../constants/devil.union.percent.enum';
import { SpellEntity } from '../../grimoire/entity/spell.entity';

import { DevilEntity } from './devil.entity';

@Entity('devil_default_spells')
export class DevilDefaultSpellsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: DevilUnionsPercentEnum,
        default: DevilUnionsPercentEnum.PERCENT_10,
    })
    percent: DevilUnionsPercentEnum;

    @ManyToOne(() => DevilEntity,  (devil) => devil.defaultSpells)
    @JoinColumn({
        name: 'devil_id',
        referencedColumnName: 'id',
    })
    devil: DevilEntity;

    @Column({
        name: 'devil_id',
        type: 'uuid',
        unique: false,
    })
    devilId: string;

    @OneToOne(() => SpellEntity)
    @JoinColumn({
        name: 'spell_id',
        referencedColumnName: 'id',
    })
    spell: SpellEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
