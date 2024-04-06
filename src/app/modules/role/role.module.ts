import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
@Module({
    controllers: [],
    providers: [RoleService],
    exports: [RoleService],
    imports: [],
})
export class RoleModule {}
