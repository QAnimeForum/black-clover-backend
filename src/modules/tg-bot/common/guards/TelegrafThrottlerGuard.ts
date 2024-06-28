import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { BotContext } from '../../interfaces/bot.context';

@Injectable()
export class TelegrafThrottlerGuard extends ThrottlerGuard {
    protected async handleRequest(
        context: ExecutionContext,
        limit: number,
        ttl: number,
        throttler: ThrottlerOptions
    ): Promise<boolean> {
        const tgExecutionContext = TelegrafExecutionContext.create(context);
        const tgCtx = tgExecutionContext.getContext<BotContext>();
        const key = this.generateKey(
            context,
            tgCtx.from.id.toString(),
            throttler.name
        );
        const { totalHits } = await this.storageService.increment(key, ttl);

        if (totalHits > limit) {
            throw new HttpException(
                'слишком много запросов',
                HttpStatus.BAD_REQUEST
            );
        }

        return true;
    }
}
