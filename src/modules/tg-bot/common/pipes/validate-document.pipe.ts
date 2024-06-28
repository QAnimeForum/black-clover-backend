import { Injectable, PipeTransform } from '@nestjs/common';
import { Document } from 'telegraf/typings/core/types/typegram';
import { InvalidAnswerException } from '../exceptions/invalid-answer.exception';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
export interface ValidateDocumentOptions {
    maxSizeInBytes: number;
    extname: string;
}

@Injectable()
export class ValidateDocumentPipe implements PipeTransform {
    constructor(private options: ValidateDocumentOptions) {}

    transform(ctx: BotContext) {
        const document = (ctx.update as any).message.document as Document;
        if (document.file_size > this.options.maxSizeInBytes) {
            throw new InvalidAnswerException(
                'Файл слишком большой, попробуйте ещё раз.'
            );
        }
        if (!document.mime_type.includes(this.options.extname)) {
            throw new InvalidAnswerException(
                'Неправильное расширение, попробуйте ещё раз.'
            );
        }
        return ctx;
    }
}
