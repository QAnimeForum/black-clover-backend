import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GrimoireEntity } from './grimoire.entity';
@Entity('spell')
export class SpellEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    description: string;
    @Column({
        type: 'varchar',
    })
    school: string;
    @Column({
        type: 'varchar',
    })
    readonly castTime: string;
    @Column({
        type: 'varchar',
    })
    readonly range: string;
    @Column({
        type: 'boolean',
    })
    readonly concentration: boolean;
    @Column({
        type: 'varchar',
    })
    readonly duration: string;
    /*  @Column({
        type: 'string',
    })
    readonly components: string[];*/
    @Column({
        type: 'varchar',
    })
    readonly material: string;
    @Column({
        type: 'varchar',
    })
    readonly minimumLevel: string;
    @Column({
        type: 'bool',
    })
    readonly ritual: boolean;
    @Column({
        type: 'bool',
    })
    readonly spellAttack: boolean;
    @Column({
        type: 'varchar',
    })
    spellcastingAbility: string;

    @ManyToOne(() => GrimoireEntity, (grimoire) => grimoire.spells)
    grimoire: GrimoireEntity;
}

/**
 * Название: вы можете придумать название своего заклинания на любом языке, но вам придется использовать русский алфавит и соблюдать правила чата.

Кости: Кости должны соответствовать скорости. магии.

Урон: При повышении навыка, повышается урон.

Затраты маны: 

Тип: Созидание/Восстановление (Исцеление)/Комбинированная/Усиление/Ограничение/Ловушка/Руническое/Зона маны

Вызываемый эффект: Каждый эффект заставляет умение тратить больше магической силы.

Цели: Здесь описываетcя, какое количество целей и при каких условиях затрагивает навык (Примеры: одиночная цель, заклинание по площади)

Перезарядка: количество ходов для следующей возможности использовать заклинание.

Требования: будут прописаны требования к использованию каких-либо эффектов.

Описание: Опишите, как работает заклинание в бою (по желанию, можно описать его эффекты вне боя).

Время восстановления:
 */