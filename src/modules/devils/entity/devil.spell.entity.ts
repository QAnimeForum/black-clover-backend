import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DevilUnionEntity } from './devil.union.entity';
@Entity('devil_spell')
export class DevilSpellEntity {
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

    @ManyToOne(() => DevilUnionEntity, (devilUnion) => devilUnion.spells)
    @JoinColumn({ name: 'union_id', referencedColumnName: 'id' })
    union: DevilUnionEntity;


    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
