import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserEnity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from '../characters/entity/character.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [UserEnity, CharacterEntity],
            process.env.DATABASE_NAME
        ),
    ],
    controllers: [UserController],
    providers: [UserService, TypeOrmModule],
    exports: [UserService],
})
export class UserModule {}
