import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { DevilUnionEntity } from './devil.union.entity';
import { ENUM_DEVIL_RANK } from '../constants/devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from '../constants/devil.floor.enum';

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
        type: 'varchar',
    })
    magic_type: string;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_10_id',
    })
    union_10: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_25_id',
    })
    union_25: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_50_id',
    })
    union_50: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_65_id',
    })
    union_65: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_80_id',
    })
    union_80: DevilUnionEntity;

    @OneToOne(() => DevilUnionEntity)
    @JoinColumn({
        name: 'union_100_id',
    })
    union_100: DevilUnionEntity;
}
