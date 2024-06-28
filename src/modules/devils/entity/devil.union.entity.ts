import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DevilUnionsPercentEnum } from '../constants/devil.union.percent.enum';
import { CharacterEntity } from '../../character/entity/character.entity';
import { DevilEntity } from './devil.entity';

@Entity('devil_union')
export class DevilUnionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: DevilUnionsPercentEnum,
        default: DevilUnionsPercentEnum.PERCENT_10,
    })
    maxAvailablePercent: DevilUnionsPercentEnum;

    @Column({
        type: 'enum',
        enum: DevilUnionsPercentEnum,
        default: DevilUnionsPercentEnum.PERCENT_10,
    })
    currentPercent: DevilUnionsPercentEnum;

    @OneToOne(() => DevilEntity)
    @JoinColumn({
        name: 'devil_id',
        referencedColumnName: 'id',
    })
    devil: DevilEntity;

    @Column({
        name: 'devil_id',
        type: 'uuid',
    })
    devilId: string;

    @OneToOne(() => CharacterEntity)
    @JoinColumn({
        name: 'character_id',
        referencedColumnName: 'id',
    })
    character: CharacterEntity;

    @Column({
        name: 'character_id',
        type: 'uuid',
    })
    characterId: string;
   /* @OneToMany(() => SpellEntity, (devilSpell) => devilSpell.union)
    spells: Array<SpellEntity>;*/

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
