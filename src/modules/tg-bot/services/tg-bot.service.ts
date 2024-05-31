import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { unlink, writeFile } from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { Composer } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotContext } from '../interfaces/bot.context';
import { getFileMimeType } from 'src/utils/utils';
import { ForbiddenError } from '@casl/ability';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CharacterService } from 'src/modules/character/services/character.service';

@Injectable()
export class TgBotService {
    
    async downloadAndSaveLocalFile(filePath: string) {
        //  const botToken = this.configService.get(EnvVariablesKeys.tgBotToken);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const fileURL = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const fileMimeType = getFileMimeType(filePath);
        const fileName = `${randomUUID()}.${fileMimeType}`;
        const relativeFilePath = join('media/images', fileName);
        const absoluteFilePath = join(process.cwd(), relativeFilePath);
        try {
            const response = await fetch(fileURL);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await writeFile(absoluteFilePath, buffer);
            return { localFilePath: relativeFilePath, fileName };
        } catch (e) {
            await unlink(absoluteFilePath);
            throw new Error('Error while saving image file.');
        }
    }

    async catchException(exception: Error, ctx: BotContext, logger?: Logger) {
        if (exception instanceof Error) {
            logger?.error(`${exception.message} \n ${exception.stack}`);
        }
        if (exception instanceof ForbiddenException) {
            await ctx.reply('Тебе туда нельзя...');
            return;
        }
        await ctx.reply('Попробуйте позже');
        //  await ctx.reply(ctx.i18n.t(LanguageTexts.tryLater));
    }
    /*
    async insertTgLogToDb({ message }: BotContext) {
        if (message) {
            const tgBotLogDto: TgBotLogDto = {
                chatId: String(message.chat.id),
                isBot: message.from.is_bot,
                tgId: String(message.from.id),
                firstName: message.from.first_name,
                username: message.from.username,
                messageId: String(message.message_id),
                // @ts-ignore
                text: message.text,
            };
            await this.dbLoggerService.insertTgLogToDb(tgBotLogDto);
        }
    }*/
    /*
    async saveFileAndGetLink(ctx: BotContext, fileId: string) {
        const mediaHost = this.configService.get(EnvVariablesKeys.mediaHost);
        const { file_path } = await ctx.telegram.getFile(fileId);
        const fileMimeType = getFileMimeType(file_path);
        if (isValidImageFile(fileMimeType)) {
            const { localFilePath } =
                await this.downloadAndSaveLocalFile(file_path);
            return `${mediaHost}/${localFilePath}`;
        }
    }*/

    createComposer(handler: (composer: Composer<BotContext>) => void) {
        const composer = new Composer<BotContext>();
        composer.use(async (ctx, next) => {
            // await this.insertTgLogToDb(ctx);
            return next();
        });
        composer.start((ctx) => ctx.scene.leave());
        handler(composer);
        return composer;
    }
}
