import { CharacterEntity } from '../../character/entity/character.entity';
import { Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

export enum UserPrivilegeType {
    ManageUser = 'ManageUser',
    ManageUserGroup = 'ManageGrimoire',
    ManageProblem = 'ManageProblem',
    ManageArmedForces = 'ManageSquads',
}

@Entity('user_privilege')
export class UserPrivilegeEntity {
    @ManyToOne(() => CharacterEntity, {
        onDelete: 'CASCADE',
    })
    character: CharacterEntity;

    @PrimaryColumn()
    @Index()
    userId: string;

    @PrimaryColumn({
        type: 'enum',
        enum: UserPrivilegeType,
    })
    @Index()
    privilegeType: UserPrivilegeType;
}
