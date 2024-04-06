import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';

export const RoleDatabaseName = 'roles';

@Entity('role')
export class RoleEntity {
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
        type: 'boolean',
    })
    isActive: boolean;

    @Column({
        type: 'enum',
        enum: ENUM_ROLE_TYPE,
        default: ENUM_ROLE_TYPE.USER,
    })
    type: ENUM_ROLE_TYPE;

   /* @Prop({
        required: true,
        default: [],
        _id: false,
        type: [
            {
                subject: {
                    type: String,
                    enum: ENUM_POLICY_SUBJECT,
                    required: true,
                },
                action: {
                    type: Array,
                    required: true,
                    default: [],
                },
            },
        ],
    })
    permissions: IPolicyRule[];*/
}
