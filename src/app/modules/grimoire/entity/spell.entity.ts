import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
