import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
    Context,
    Hears,
    InjectBot,
    Message,
    On,
    SceneEnter,
    Sender,
    TELEGRAF_STAGE,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Scenes, Telegraf } from 'telegraf';
import { BackgroundService } from 'src/modules/character/services/background.service';
import { message } from 'telegraf/filters';
import { LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import { getFileMimeType } from 'src/utils/utils';
import { randomUUID } from 'crypto';
import { join } from 'lodash';
import { writeFile } from 'fs';

@Injectable()
export class AvatarEditWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly backgroundService: BackgroundService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.EDIT_AVATAR_SCENE_ID,
            this.start(),
            this.step1()
        );

        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            await ctx.reply('Введите своё новое имя.');
            ctx.wizard.next();
        });
        return composer;
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.on(message('photo'), async (ctx) => {
            const photo = ctx.message.photo[0];

            const link = await ctx.telegram.getFileLink(photo.file_id);
            const url = link.href;
            await ctx.telegram.sendPhoto(ctx.update?.message.from.id, {
                url: url,
            });
            console.log(link);
            await ctx.replyWithPhoto(photo.file_id, {
                caption: '',
                parse_mode: 'HTML',
              });
          /**
           *   const botToken = process.env.TELEGRAM_BOT_TOKEN;
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
                await ctx.telegram.sendPhoto(ctx.update?.message.from.id, {
                    url: buffer,
                });
            } catch (e) {
                await unlink(absoluteFilePath);
                throw new Error('Error while saving image file.');
            }
           */
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
            /* await this.backgroundService.updateUserName({
                name: message,
                telegramId: ctx.update?.message.from.id,
            });
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно изменил имя персонажа. * { name: ${ctx.update.message.from.first_name} id: ${ctx.update.message.from.id}}`
            );
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);*/
        });
        return composer;
    }
}

/*@Wizard(ENUM_SCENES_ID.EDIT_AVATAR_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AvatarEditWizard {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        ctx.reply('Пришлите новую аватарку.');
    }

    @WizardStep(1)
    async changeName(
        @Context() ctx: BotContext,
        @Sender('id') id,
        @Message('text') msg: string
    ) {
        this.characterService.changeCharacterName({
            id: id,
            name: msg,
        });
        ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }

    @Hears(/^\/?(cancel)$/i)
    async onCancel(@Context() ctx: BotContext) {
        await ctx.reply('Имя не изменено.');
        await ctx.scene.leave();
    }
}
*/
