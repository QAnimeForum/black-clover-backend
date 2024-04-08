import { Context, Start, Update } from 'nestjs-telegraf';
import { TgBotService } from './tg-bot.service';
import { Logger } from '@nestjs/common';
import { BotContext } from '../interfaces/bot.context';

@Update()
export class TgBotUpdate {
    private readonly logger = new Logger(TgBotUpdate.name);

    constructor(private readonly tgBotService: TgBotService) {}

    @Start()
    async onStart(@Context() ctx: BotContext) {
        await ctx.reply('Welcome');
    }
}
