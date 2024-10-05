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
import {
    DEVIL_FLOOR_1_BUTTON,
    DEVIL_FLOOR_2_BUTTON,
    DEVIL_FLOOR_3_BUTTON,
    DEVIL_FLOOR_4_BUTTON,
    DEVIL_FLOOR_5_BUTTON,
    DEVIL_FLOOR_6_BUTTON,
    DEVIL_FLOOR_7_BUTTON,
    DEVIL_RANK_1_BUTTON,
    DEVIL_RANK_2_BUTTON,
    DEVIL_RANK_3_BUTTON,
    DEVIL_RANK_4_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { DevilsService } from 'src/modules/devils/services/devils.service';
import { ENUM_DEVIL_FLOOR } from 'src/modules/devils/constants/devil.floor.enum';
import { ENUM_DEVIL_RANK } from 'src/modules/devils/constants/devil.ranks.enum';

@Injectable()
export class DevilCreateWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly devilsService: DevilsService
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.DEVIL_CREATE_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.devil = {
                name: '',
                description: '',
                floor: ENUM_DEVIL_FLOOR.ONE,
                rank: ENUM_DEVIL_RANK.LOW,
                magicType: '',
                image: '',
            };
            await ctx.reply(
                `🧟 Пришлите фотографию предмета в виде файла.\nТребования к файлу:\n 1. Формат: png/jpg/jpeg/gif\n2. Присылать в виде файла\n(Для отмены поиска нажмите /cancel)`,
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
            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('document'), async (ctx) => {
            console.log('wtf');
            try {
                const fileId = ctx.message['document'];
                console.log(fileId);
                const url = await ctx.telegram.getFileLink(fileId);
                const oldFileName = ctx.message['document'].file_name;
                const saveFormat = oldFileName
                    .split('.')
                    [oldFileName.split('.').length - 1].toLowerCase();
                const file = await this.downloadFile(
                    url.href,
                    `${process.env.APP_API_URL}/Assets/images/tmp/devils/${ctx.from.id}`,
                    `${ctx.from.id}.${saveFormat}`
                );
                console.log(file);
                ctx.scene.session.devil.image = `${process.env.APP_API_URL}/Assets/images/tmp/devils/${ctx.from.id}/${ctx.from.id}.${saveFormat}`;
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
        
                await ctx.reply('Введите имя дьявола.');
                ctx.wizard.next();
            } catch (e) {
                this.logger.log(
                    LOGGER_EXCEPTION,
                    `🔴 Не удалось загрузить фотографию. * { name: ${ctx.update.message.from.first_name} id: ${ctx.update.message.from.id}}`
                );
                await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
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
        console.log(downloadStatus);
        if (downloadStatus === 'COMPLETE') {
            return filePath;
        } else return false;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.devil.name = ctx.update.message.text;
            await ctx.reply('Введите магический атрибут.');
            ctx.wizard.next();
        });
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.devil.magicType = ctx.update.message.text;
            await ctx.reply('Введите описание дьявола.');
            ctx.wizard.next();
        });
        return composer;
    }
    step4() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.devil.description = ctx.update.message.text;
            await ctx.reply('Выберите ранг дьявола.', {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            DEVIL_RANK_1_BUTTON,
                            ENUM_DEVIL_RANK.HIGHEST
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_2_BUTTON,
                            ENUM_DEVIL_RANK.HIGH
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_3_BUTTON,
                            ENUM_DEVIL_RANK.MID
                        ),
                    ],
                    [
                        Markup.button.callback(
                            DEVIL_RANK_4_BUTTON,
                            ENUM_DEVIL_RANK.LOW
                        ),
                    ],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step5() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.action(/(1|2|3|4)/g, async (ctx) => {
            await ctx.answerCbQuery();
            const rank = ctx.callbackQuery['data'];
            ctx.scene.session.devil.rank = rank;
            await ctx.reply('Выберите этаж дьявола.', {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(DEVIL_FLOOR_1_BUTTON, '1')],
                    [Markup.button.callback(DEVIL_FLOOR_2_BUTTON, '2')],
                    [Markup.button.callback(DEVIL_FLOOR_3_BUTTON, '3')],
                    [Markup.button.callback(DEVIL_FLOOR_4_BUTTON, '4')],
                    [Markup.button.callback(DEVIL_FLOOR_5_BUTTON, '5')],
                    [Markup.button.callback(DEVIL_FLOOR_6_BUTTON, '6')],
                    [Markup.button.callback(DEVIL_FLOOR_7_BUTTON, '7')],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step6() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        composer.action(/(1|2|3|4|5|6|7)/g, async (ctx) => {
            await ctx.answerCbQuery();
            const floor = ctx.callbackQuery['data'];
            ctx.scene.session.devil.rank = floor;
            console.log(ctx.scene.session.devil);
            await ctx.scene.enter(ENUM_SCENES_ID.ALL_DEVILS_SCENE_ID);
        });
        return composer;
    }
}
