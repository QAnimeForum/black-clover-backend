import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserPrivilegeService } from './services/user-privilege.service';
import { UserPrivilegeEntity } from './entities/user-prviliege.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserPrivilegeEntity])],
    exports: [UserService, UserPrivilegeService],
    providers: [UserService, UserPrivilegeService],
})
export class UserModule {}
