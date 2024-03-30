import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DevilFloorEnum } from '../constants/devil.flor.enum';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';

@Entity('devils')
export class DevilEntity {
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

    /**
     *   @Column({
    type: "enum",
    enum: MenuStatusEnum,
    default: MenuStatusEnum.ACTIVE,
    nullable: false,
    name: "status_enum"
  })
     */
    @Column({
        type: 'enum',
        enum: DevilFloorEnum,
        default: DevilFloorEnum.ONE,
        nullable: false,
    })
    floor: DevilFloorEnum;

    @Column({
        type: 'enum',
        enum: DevilRanksEnum,
        default: DevilRanksEnum.LOW,
    })
    rank: DevilRanksEnum;

    @Column({
        type: 'varchar',
    })
    magic_type: string;
}
