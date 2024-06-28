import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { CharacterModule } from '../character/character.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), CharacterModule],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
