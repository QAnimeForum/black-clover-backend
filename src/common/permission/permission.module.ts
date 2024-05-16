import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionForUserEntity } from './permission.user.entity';
import { PermissionService } from './permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionForUserEntity])],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
