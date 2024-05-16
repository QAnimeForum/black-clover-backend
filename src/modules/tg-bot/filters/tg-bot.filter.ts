import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { TgBotService } from '../services/tg-bot.service';
import { BotContext } from '../interfaces/bot.context';
@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(TelegrafExceptionFilter.name);

    constructor(private readonly tgBotService: TgBotService) {}

    async catch(exception: Error, host: ArgumentsHost): Promise<void> {
        console.log(exception);
        const telegrafHost = TelegrafArgumentsHost.create(host);
        const ctx = telegrafHost.getContext<BotContext>();
        await this.tgBotService.catchException(exception, ctx, this.logger);
    }
}
