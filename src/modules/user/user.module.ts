import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserPrivilegeService } from './services/user-privilege.service';
import { UserPrivilegeEntity } from './entities/user-prviliege.entity';
import { CharacterService } from '../character/services/character.service';
import { CharacterModule } from '../character/character.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserPrivilegeEntity]),
        CharacterModule,
    ],
    exports: [UserService, UserPrivilegeService],
    providers: [UserService, UserPrivilegeService],
})
export class UserModule {}
