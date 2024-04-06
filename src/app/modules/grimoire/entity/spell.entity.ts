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
    range: string;
    @Column({
        type: 'varchar',
    })
    duration: string;
    @Column({
        type: 'varchar',
    })
    cost: string;
    @Column({
        type: 'varchar',
    })
    castTime: string;
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
