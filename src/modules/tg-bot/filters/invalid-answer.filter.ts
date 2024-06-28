import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { InvalidAnswerException } from '../common/exceptions/invalid-answer.exception';
@Catch(InvalidAnswerException)
export class InvalidAnswerFilter implements ExceptionFilter {
    async catch(
        exception: InvalidAnswerException,
        host: ArgumentsHost
    ): Promise<void> {
        const telegrafHost = TelegrafArgumentsHost.create(host);
        const ctx = telegrafHost.getContext<WizardContext>();
        await ctx.reply(exception.message);
        ctx.wizard.selectStep(ctx.wizard.cursor);
    }
}
