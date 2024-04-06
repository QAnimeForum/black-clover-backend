import { RoleEntity } from '../../role/entities/role.entity';
import { UserEntity } from '../entities/user.entity';

export interface IUserEntity extends Omit<UserEntity, 'role'> {
    role: RoleEntity;
}
