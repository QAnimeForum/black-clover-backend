import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity], process.env.DATABASE_NAME),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
