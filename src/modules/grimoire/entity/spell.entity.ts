import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';
import { SpellRequirementsEntity } from './spell.requirements.entity';
import { ENUM_SPELL_STATUS } from '../constants/spell.status.enum.constant';
import { ENUM_SPELL_TYPE } from '../constants/spell.type.enum';

@Entity('spell')
export class SpellEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Имя: вы можете придумать название своего заклинания на любом языке
     * , но вам придется использовать русский алфавит и соблюдать правила форума.
     */
    @Column({
        type: 'varchar',
        unique: false,
    })
    name: string;

    /**
     *  Описание: опишите, как работает навык и его эффекты вне боя.
     */
    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'varchar',
    })
    damage: string;

    @Column({
        type: 'varchar',
    })
    range: string;
    @Column({
        type: 'varchar',
    })
    duration: string;

    /**
     * Расход маны: обычно решает , но должен быть как минимум на 20 маны меньше, чем урон навыка.

     */
    @Column({
        type: 'varchar',
    })
    cost: string;

    /**
     * количество ходов
     */
    @Column({
        type: 'varchar',
        name: 'cast_type',
    })
    castTime: string;

    /**
     * Длится 6 ходов, после этого использовать в бою невозможно, если не пройдет 12 ходов, то вообще не пойдет**
     */
    @Column({
        type: 'varchar',
    })
    cooldown: string;
    @Column({
        type: 'enum',
        enum: ENUM_SPELL_TYPE,
        default: ENUM_SPELL_TYPE.CREATION,
    })
    type: ENUM_SPELL_TYPE;

    /**
     * Цели: На кого работает навык. Примеры:
     * 1. На самого пользователя гримуара,
     * 2. Не определено
     * 3. На союзников
     * 4. На 5 целей
     * 5. Все в чате
     * 6. зависит от навыка
     */
    @Column({
        type: 'varchar',
    })
    goals: string;
    /**
     *  Требования: всем навыкам нужен уровень, поэтому, начиная с уровня 0, переходя от 5 к 5 уровням, до 50 уровня, после этого от 10 до 10 уровней, пользователи четырех клеверов продолжают с 5 до 5, а затем до 100, 50 уровня. за 50 уровней пользователи четырех клеверов идут из 25 в 25 уровней.

     */

    /*  @Column({ name: 'minimal_character_level', type: 'int' })
    minimalCharacterLevel: number;

    @Column({
        type: 'varchar',
    })*/
    requirements: string;
    @Column({
        type: 'enum',
        default: ENUM_SPELL_STATUS.DRAFT,
        enum: ENUM_SPELL_STATUS,
    })
    status: ENUM_SPELL_STATUS;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => GrimoireEntity, (grimoire) => grimoire.spells, {
        nullable: true,
    })
    @JoinColumn({
        name: 'grimoire_id',
        referencedColumnName: 'id',
    })
    grimoire: GrimoireEntity;

    @Column({
        type: 'uuid',
        name: 'grimoire_id',
        nullable: true,
    })
    grimoireId: string;
}

/* @Column({
        type: 'boolean',
    })
    concentration: boolean;*/
/*  @Column({
        type: 'string',
    })
    readonly components: string[];
        @Column({
        type: 'varchar',
    })
    material: string;
    @Column({
        type: 'varchar',
    })
    minimumLevel: string;

    @Column({
        type: 'varchar',
    })
    spellcastingAbility: string;*/
