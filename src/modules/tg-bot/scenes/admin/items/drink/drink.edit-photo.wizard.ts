import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Downloader } from 'nodejs-file-downloader';
import { LOGGER_EXCEPTION, LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import fs from 'fs';
import path from 'path';
import { DrinkService } from 'src/modules/cuisine/service/drink.service';
@Injectable()
export class DrinkPhotoChangeWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly drinkService: DrinkService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.DRINK_EDIT_PHOTO_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply(
                `🧟 Пришлите новую фотографию предмета.\nТребования к файлу:\n 1. Формат: png/jpg/jpeg/gif\n2. Присылать в виде файла\n(Для отмены поиска нажмите /cancel)`,
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
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('document'), async (ctx) => {
            const itemId = ctx.session.adminDrinkIdForEdit;
            try {
                const fileId = ctx.message['document'];
                const url = await ctx.telegram.getFileLink(fileId);
                const oldFileName = ctx.message['document'].file_name;
                const saveFormat = oldFileName
                    .split('.')
                    [oldFileName.split('.').length - 1].toLowerCase();
                const file = await this.downloadFile(
                    url.href,
                    `Assets/images/drink/${itemId}`,
                    `0.${saveFormat}`
                );
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
                const fileName = file.split('/')[file.split('/').length - 1];
                const item = await this.drinkService.updatePhoto({
                    id: itemId,
                    photo: fileName,
                });
                fs.readdir(`Assets/images/drink/${itemId}`, (err, files) => {
                    if (err) throw err;

                    for (const file of files) {
                        if (file != fileName) {
                            fs.unlink(
                                path.join(
                                    `Assets/images/items/${itemId}`,
                                    file
                                ),
                                (err) => {
                                    if (err) throw err;
                                }
                            );
                        }
                    }
                });

                this.logger.log(
                    LOGGER_INFO,
                    `🟢 Пользователь успешно изменил фотографию предмета. * {  id: ${itemId}}`
                );
                await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
            } catch (e) {
                this.logger.log(
                    LOGGER_EXCEPTION,
                    `🔴  Пользователь не смог изменить фотографию предмета. * { id: ${itemId}}`
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
}
