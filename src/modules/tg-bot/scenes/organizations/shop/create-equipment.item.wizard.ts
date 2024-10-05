import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { MarketEntity } from 'src/modules/items/entity/market.entity';
import { MarketService } from 'src/modules/items/service/market.service';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { LOGGER_EXCEPTION } from 'src/modules/tg-bot/utils/logger';
import Downloader from 'nodejs-file-downloader';
import { Logger } from 'winston';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { BACK_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';

@Injectable()
export class CreateEquipmentItemWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly equipmentItemService: EqupmentItemService
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.ITEM_CREATE_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.step7(),
            this.step8(),
            this.step9()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.item = {
                name: '',
                description: '',
                rarity: ENUM_ITEM_RARITY.COMMON,
                body: ENUM_BODY_PART_ENUM.ACCESSORY,
                image: '',
                categoryId: '',
                physicalAttackDamage: 0,
                magicAttackDamage: 0,
                magicDefense: 0,
                physicalDefense: 0,
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
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
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
                    `${process.env.APP_API_URL}/Assets/images/tmp/items/${ctx.from.id}`,
                    `${ctx.from.id}.${saveFormat}`
                );
                ctx.scene.session.item.image = `${process.env.APP_API_URL}/Assets/images/tmp/items/${ctx.from.id}/${ctx.from.id}.${saveFormat}`;
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
                await ctx.reply('Введите название предмета.');
                ctx.wizard.next();
            } catch (e) {
                this.logger.log(
                    LOGGER_EXCEPTION,
                    `🔴 Не удалось загрузить фотографию. * { name: ${ctx.update.message.from.first_name} id: ${ctx.update.message.from.id}}`
                );
                await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
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

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.item.name = ctx.update.message.text;
            await ctx.reply('Введите описание предмета.');
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
            ctx.scene.session.item.description = ctx.update.message.text;
            await ctx.reply(
                'Выберите название слота, в который надевается предметю',
                {
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                'Головной убор',
                                'ENUM_BODY_PART:' +
                                    ENUM_BODY_PART_ENUM.HEADDRESS
                            ),
                            Markup.button.callback(
                                'Броня',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.ARMOR
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Двуручный предмет',
                                'ENUM_BODY_PART:' +
                                    ENUM_BODY_PART_ENUM.TWO_HANDS
                            ),
                            Markup.button.callback(
                                'Одноручный предмет',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.HAND
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Аксессуар',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.ACCESSORY
                            ),
                            Markup.button.callback(
                                'Перчатки',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.GLOVES
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Плащ',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.CLOAK
                            ),
                            Markup.button.callback(
                                'Ботинки',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.FEET
                            ),
                        ],
                    ]),
                }
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step4() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/^(ENUM_BODY_PART.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                ctx.scene.session.item.body =
                    ctx.callbackQuery['data'].split(':')[1];
            } catch (err) {
                console.log(err);
            }
            await ctx.reply('Выберите редкость предмета.', {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Обычный предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.COMMON
                        ),
                    ],

                    [
                        Markup.button.callback(
                            'Необычный предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.UNCOMMON
                        ),
                    ],

                    [
                        Markup.button.callback(
                            'Эпический предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.EPIC
                        ),
                    ],

                    [
                        Markup.button.callback(
                            'Редкий предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.RARE
                        ),
                    ],

                    [
                        Markup.button.callback(
                            'Легендарный предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.LEGENDARY
                        ),
                    ],

                    [
                        Markup.button.callback(
                            'Уникальный предмет',
                            'ENUM_RARITY:' + ENUM_ITEM_RARITY.UNIQUE
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

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/^(ENUM_RARITY.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                ctx.scene.session.item.rarity =
                    ctx.callbackQuery['data'].split(':')[1];
            } catch (err) {
                console.log(err);
            }
            const categories = await this.equipmentItemService.findCategories();
            const buttons = [];
            for (let i = 0; i < categories.length; ++i) {
                buttons.push([
                    Markup.button.callback(
                        categories[i].name,
                        `CATEGORY_ID:${categories[i].id}`
                    ),
                ]);
            }
            await ctx.reply('Выберите категорию товара', {
                ...Markup.inlineKeyboard(buttons),
            });
            //  ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/^(CATEGORY_ID.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const categoryId = ctx.callbackQuery['data'].split(':')[1];
            if (categoryId == 'null') {
                const categories =
                    await this.equipmentItemService.findCategories();
                const buttons = [];
                for (let i = 0; i < categories.length; ++i) {
                    buttons.push([
                        Markup.button.callback(
                            categories[i].name,
                            `CATEGORY_ID:${categories[i].id}`
                        ),
                    ]);
                }
                await ctx.deleteMessage();
                await ctx.replyWithHTML('Категории', {
                    ...Markup.inlineKeyboard(buttons),
                });
            } else {
                const categories =
                    await this.equipmentItemService.findCategoriesByRoot(
                        categoryId
                    );
                const children = categories.children;
                const buttons = [];
                if (children.length > 0) {
                    for (let i = 0; i < children.length; ++i) {
                        buttons.push([
                            Markup.button.callback(
                                children[i].name,
                                `CATEGORY_ID:${children[i].id}`
                            ),
                        ]);
                    }
                    buttons.push([
                        Markup.button.callback(
                            BACK_BUTTON,
                            `CATEGORY_ID:${categories.parentId}`
                        ),
                    ]);
                    await ctx.deleteMessage();
                    await ctx.replyWithHTML('Категории', {
                        ...Markup.inlineKeyboard(buttons),
                    });
                } else {
                    buttons.push([
                        Markup.button.callback('Да', `YES:${categories.id}`),
                    ]);
                    buttons.push([
                        Markup.button.callback('Нет', `NO:${categories.id}`),
                    ]);
                    await ctx.replyWithHTML(
                        `Вы хотите выбрать категорию ${categories.name}`,
                        {
                            ...Markup.inlineKeyboard(buttons),
                        }
                    );
                }
            }
        });

        composer.action(/^(YES.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                ctx.scene.session.item.categoryId =
                    ctx.callbackQuery['data'].split(':')[1];
            } catch (err) {
                console.log(err);
            }
            await ctx.reply('Введите физический урон.');
            ctx.wizard.next();
        });

        composer.action(/^(NO.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const categoryId = ctx.callbackQuery['data'].split(':')[1];
            if (categoryId == 'null') {
                const categories =
                    await this.equipmentItemService.findCategories();
                const buttons = [];
                for (let i = 0; i < categories.length; ++i) {
                    buttons.push([
                        Markup.button.callback(
                            categories[i].name,
                            `CATEGORY_ID:${categories[i].id}`
                        ),
                    ]);
                }
                await ctx.deleteMessage();
                await ctx.replyWithHTML('Категории', {
                    ...Markup.inlineKeyboard(buttons),
                });
            } else {
                const categories =
                    await this.equipmentItemService.findCategoriesByRoot(
                        categoryId
                    );
                const children = categories.children;
                const buttons = [];
                if (children.length > 0) {
                    for (let i = 0; i < children.length; ++i) {
                        buttons.push([
                            Markup.button.callback(
                                children[i].name,
                                `CATEGORY_ID:${children[i].id}`
                            ),
                        ]);
                    }
                    buttons.push([
                        Markup.button.callback(
                            BACK_BUTTON,
                            `CATEGORY_ID:${categories.parentId}`
                        ),
                    ]);
                    await ctx.deleteMessage();
                    await ctx.replyWithHTML('Категории', {
                        ...Markup.inlineKeyboard(buttons),
                    });
                }
            }
        });
        return composer;
    }

    step6() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.item.physicalAttackDamage = Number.parseInt(
                ctx.update.message.text
            );
            await ctx.reply('Введите магический урон');
            ctx.wizard.next();
        });
        return composer;
    }

    step7() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.item.magicAttackDamage = Number.parseInt(
                ctx.update.message.text
            );
            await ctx.reply('Введите физическую защиту.');
            ctx.wizard.next();
        });
        return composer;
    }

    step8() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.item.physicalDefense = Number.parseInt(
                ctx.update.message.text
            );
            await ctx.reply('Введите магическую защиту.');
            ctx.wizard.next();
        });
        return composer;
    }
    step9() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.item.magicDefense = Number.parseInt(
                ctx.update.message.text
            );
            await this.equipmentItemService.create(ctx.scene.session.item);
            ctx.scene.session.item = null;
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        return composer;
    }
}
