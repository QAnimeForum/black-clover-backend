import { SetMetadata } from '@nestjs/common';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';
export const ROLES_KEY = 'ROLES';

export const AllowedRoles = (...args: ENUM_ROLE_TYPE[]) =>
    SetMetadata(ROLES_KEY, args);
