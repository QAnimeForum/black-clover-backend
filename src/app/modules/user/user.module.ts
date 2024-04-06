import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
    providers: [UserService],
    controllers: [],
})
export class UserModule {}
