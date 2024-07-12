import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { DevilUnionEntity } from './devil.union.entity';
import { ENUM_DEVIL_RANK } from '../constants/devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from '../constants/devil.floor.enum';
import { DevilDefaultSpellsEntity } from './devil.default.spells.entity';

@Entity('devils')
export class DevilEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        name: 'image_path',
        type: 'varchar',
    })
    image: string;
    @Column({
        type: 'enum',
        enum: ENUM_DEVIL_FLOOR,
        default: ENUM_DEVIL_FLOOR.ONE,
        nullable: false,
    })
    floor: ENUM_DEVIL_FLOOR;

    @Column({
        type: 'enum',
        enum: ENUM_DEVIL_RANK,
        default: ENUM_DEVIL_RANK.LOW,
        nullable: false,
    })
    rank: ENUM_DEVIL_RANK;

    @Column({
        name: 'magic_type',
        type: 'varchar',
    })
    magicType: string;

    @OneToMany(
        () => DevilDefaultSpellsEntity,
        (defaultSpell) => defaultSpell.devil
    )
    defaultSpells: DevilDefaultSpellsEntity;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
