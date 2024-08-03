import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { SquadMemberEntity } from './squad.member.entity';
import { ArmedForcesEntity } from './armed.forces.entity';
import { MoneyEntity } from '../../money/entity/money.entity';

@Tree('nested-set')
@Entity('armed_forces_rank')
export class ArmedForcesRankEntity {
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
        type: 'int',
    })
    star: number;

    @TreeParent()
    parent: ArmedForcesRankEntity;

    @TreeChildren()
    children: ArmedForcesRankEntity[];

    /**
     * 
    @Column({
        type: 'varchar',
        name: 'parent_ran_id',
        nullable: true,
    })
    parentRank: ArmedForcesRankEntity;

    @Column({
        type: 'varchar',
        name: 'parent_category_id',
        nullable: true,
    })
    parentRankId: string;
     */
     @OneToOne(() => MoneyEntity)
    @JoinColumn({
        name: 'salary_id',
        referencedColumnName: 'id',
    })
    salary: MoneyEntity;


    @OneToMany(() => SquadMemberEntity, (member) => member.squad)
    members: Array<SquadMemberEntity>;

    @ManyToOne(() => ArmedForcesEntity)
    @JoinColumn({
        name: 'forces_id',
        referencedColumnName: 'id',
    })
    armorForces: ArmedForcesEntity;

    @Column({
        type: 'varchar',
        name: 'forces_id',
    })
    armorForcesId: string;

    @Column({
        type: 'uuid',
        name: 'parentId',
    })
    parentId: string | null;
    /*   @Column({
        type: 'varchar',
    })
    permissions: string[];*/
}
