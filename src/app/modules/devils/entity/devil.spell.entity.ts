import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DevilUnion } from './devil.union.entity';

@Entity('devil_Spell')
export class DevilSpellEntity {
    @PrimaryColumn('uuid')
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
        type: 'int',
    })
    cost: string;

    @Column({
        type: 'int',
    })
    castTime: string;

    @ManyToOne(() => DevilUnion, (devilUnion) => devilUnion.spells)
    @JoinColumn({ name: 'union_id', referencedColumnName: 'id' })
    union: DevilUnion;
}
