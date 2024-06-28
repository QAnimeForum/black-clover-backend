import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ArmedForcesJobPermissionEntity } from './armed.forces.permission.entity';
import { ArmedForcesMemberEntity } from './armed.forces.member.entity';

@Entity('armed_forces_job')
export class ArmedForcesJobTitleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;

    @OneToOne(() => ArmedForcesJobPermissionEntity)
    @JoinColumn({
        name: 'permissions_id',
        referencedColumnName: 'id',
    })
    permissions: ArmedForcesJobPermissionEntity;

    @Column({
        name: 'permissions_id',
        type: 'uuid',
    })
    permissionsId: string;

    @OneToMany(() => ArmedForcesMemberEntity, (member) => member.jobTitle)
    members: Array<ArmedForcesMemberEntity>;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
