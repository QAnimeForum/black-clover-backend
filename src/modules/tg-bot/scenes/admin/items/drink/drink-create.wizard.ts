import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_EXCEPTION } from 'src/modules/tg-bot/utils/logger';
import Downloader from 'nodejs-file-downloader';
import { Logger } from 'winston';
import { DrinkService } from 'src/modules/cuisine/service/drink.service';

@Injectable()
export class CreateDrinkWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly drinkService: DrinkService
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.DRINK_CREATE_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.drink = {
                name: '',
                description: '',
                image: '',
            };
            await ctx.reply(
                `🧟 Пришлите фотографию напитка в виде файла.\nТребования к файлу:\n 1. Формат: png/jpg/jpeg/gif\n2. Присылать в виде файла\n(Для отмены поиска нажмите /cancel)`,
                {
                    parse_mode: 'HTML',
                    ...Markup.removeKeyboard(),
                }
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Фотография не изменена.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        composer.on(message('document'), async (ctx) => {
            try {
                const fileId = ctx.message['document'];
                const url = await ctx.telegram.getFileLink(fileId);
                const oldFileName = ctx.message['document'].file_name;
                const saveFormat = oldFileName
                    .split('.')
                    [oldFileName.split('.').length - 1].toLowerCase();
                const file = await this.downloadFile(
                    url.href,
                    `${process.env.APP_API_URL}/Assets/images/tmp/drinks/${ctx.from.id}`,
                    `${ctx.from.id}.${saveFormat}`
                );

                ctx.scene.session.drink.image = `${process.env.APP_API_URL}/Assets/images/tmp/drinks/${ctx.from.id}/${ctx.from.id}.${saveFormat}`;
                if (!file) {
                    await ctx.reply('Ошибка загрузки файла');
                    return;
                }

                const array = file.split('.');
                const format = array[array.length - 1].toLowerCase();
                if (
                    format !== 'png' &&
                    format !== 'jpg' &&
                    format !== 'jpeg' &&
                    format !== 'gif'
                ) {
                    await ctx.reply('Неправильный формат файла');
                    return;
                }
                await ctx.reply('Введите название напитка.');
                ctx.wizard.next();
            } catch (e) {
                this.logger.log(
                    LOGGER_EXCEPTION,
                    `🔴 Не удалось загрузить фотографию. * { name: ${ctx.update.message.from.first_name} id: ${ctx.update.message.from.id}}`
                );
                await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
            }
        });
        return composer;
    }

    async downloadFile(
        url: string,
        filepath: string,
        filename: string
    ): Promise<string | false> {
        const downloader = new Downloader({
            url: url,
            directory: filepath,
            fileName: filename,
        });
        const { filePath, downloadStatus } = await downloader.download();
        if (downloadStatus === 'COMPLETE') {
            return filePath;
        } else return false;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.drink.name = ctx.update.message.text;
            await ctx.reply('Введите описание напитка.');
            ctx.wizard.next();
        });
        return composer;
    }
    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.drink.description = ctx.update.message.text;
            const drink = await this.drinkService.create({
                name: ctx.scene.session.drink.name,
                description: ctx.scene.session.drink.description,
                imageUrl: ctx.scene.session.drink.image,
            });
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        return composer;
    }
}
