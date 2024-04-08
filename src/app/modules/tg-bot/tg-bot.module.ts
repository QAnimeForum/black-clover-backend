import { Module } from '@nestjs/common';
import { TgBotService } from './services/tg-bot.service';
import { TgBotUpdate } from './services/tg-bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [TgBotUpdate, TgBotService],
})
export class TgBotModule {}
