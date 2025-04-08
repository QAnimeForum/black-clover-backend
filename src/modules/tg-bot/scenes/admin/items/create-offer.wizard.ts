import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'typeorm';

import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { ShopService } from 'src/modules/items/service/shop.service';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';

@Injectable()
export class CreateOfferWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly shopService: ShopService,
        private readonly equipmentItemService: EqupmentItemService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID,
            this.step1(),
            this.step2()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.offerAmount = {
                itemId: '',
                copper: 0,
                silver: 0,
                electrum: 0,
                gold: 0,
                platinum: 0,
            };
            ctx.scene.session.offerAmount.itemId = ctx.session.itemId;
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Создание предложение в магазине прервано.');
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const array = ctx.update.message.text.split(' ');
            if (array.length !== 5) {
                ctx.reply(
                    'Введено не 5 чисел. \nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const isAllItemsInteger = array.every((item) =>
                Number.isInteger(item)
            );
            if (isAllItemsInteger) {
                ctx.reply(
                    'Не все введённые символы являются цифры.\nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const copperText = ` Медные: ${array[0]}\n`;
            const silverText = `Серебряные: ${array[1]}\n`;
            const electrumText = `Электрумовые: ${array[2]}\n`;
            const goldText = `Золотые: ${array[3]}\n`;
            const platinumText = `Платиновые: ${array[4]}\n`;
            ctx.scene.session.offerAmount.copper = Number.parseInt(array[0]);
            ctx.scene.session.offerAmount.silver = Number.parseInt(array[1]);
            ctx.scene.session.offerAmount.electrum = Number.parseInt(array[2]);
            ctx.scene.session.offerAmount.gold = Number.parseInt(array[3]);
            ctx.scene.session.offerAmount.platinum = Number.parseInt(array[4]);
            const caption =
                `Вы хотите назначить предмету сумму:\n` +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;

            await ctx.reply(caption, {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Да', 'yes')],
                    [Markup.button.callback('Изменить сумму', 'CHANGE_MONEY')],
                    //     [Markup.button.callback('Изменить id', 'CHANGE_ID')],
                    [
                        Markup.button.callback(
                            'Отменить добавление в магазин',
                            'CANCEL_ORDER'
                        ),
                    ],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        composer.action('yes', async (ctx) => {
            await ctx.answerCbQuery();
            const copperText = ` Медные: ${ctx.scene.session.offerAmount.copper}\n`;
            const silverText = `Серебряные: ${ctx.scene.session.offerAmount.silver}\n`;
            const electrumText = `Электрумовые: ${ctx.scene.session.offerAmount.electrum} \n`;
            const goldText = `Золотые: ${ctx.scene.session.offerAmount.gold}\n`;
            const platinumText = `Платиновые: ${ctx.scene.session.offerAmount.platinum}\n`;

            const caption =
                'Товару назначена сумма:' +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;
            await ctx.reply(caption);
            await this.shopService.createOffer({
                itemId: ctx.scene.session.offerAmount.itemId,
                ...ctx.scene.session.offerAmount,
            });
            ctx.scene.session.offerAmount = null;

            await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });

        composer.action('CHANGE_MONEY', async (ctx) => {
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.back();
            ctx.wizard.selectStep(1);
        });
        composer.action('CANCEL', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        return composer;
    }
}
/*
@Injectable()
export class CreateOfferWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly shopService: ShopService,
        private readonly equipmentItemService: EqupmentItemService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID,
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
            ctx.scene.session.offerAmount = {
                itemId: '',
                copper: 0,
                silver: 0,
                electrum: 0,
                gold: 0,
                platinum: 0,
            };
            const items = await this.equipmentItemService.findAllEquipmentItems(
                {
                    path: '',
                    sortBy: [['name', 'ASC']],
                    limit: 10,
                    page: 1,
                }
            );
            const [caption, buttons] = this.showItems(items);
            console.log(buttons);
            ctx.reply(caption, {
                ...Markup.inlineKeyboard(buttons),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });

        composer.action(/^(ITEMS_NEXT_PAGE_ACTION.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const page = Number.parseInt(
                ctx.callbackQuery['data'].split(':')[1]
            );

            const items = await this.equipmentItemService.findAllEquipmentItems(
                {
                    path: '',
                    sortBy: [['name', 'ASC']],
                    limit: 10,
                    page: page,
                }
            );
            const [caption, buttons] = this.showItems(items);
            console.log(buttons);
            await ctx.editMessageText(null, {
                ...Markup.inlineKeyboard(buttons),
            });
        });

        composer.action(/^(ITEMS_PREVIOUS_ACTION.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const page = Number.parseInt(
                ctx.callbackQuery['data'].split(':')[1]
            );
            const items = await this.equipmentItemService.findAllEquipmentItems(
                {
                    path: '',
                    sortBy: [['displayId', 'ASC']],
                    limit: 10,
                    page: page,
                }
            );
            const [caption, buttons] = this.showItems(items);
            await ctx.editMessageText(null, {
                ...Markup.inlineKeyboard(buttons),
            });
        });

        composer.action(/^(ITEM.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const itemId = ctx.callbackQuery['data'].split(':')[1];
            ctx.scene.session.offerAmount.itemId = itemId;
            await this.showItem(ctx, itemId);
        });

        composer.action(BACK_BUTTON, async (ctx) => {
            await ctx.answerCbQuery();
            const items = await this.equipmentItemService.findAllEquipmentItems(
                {
                    path: '',
                    sortBy: [['name', 'ASC']],
                    limit: 10,
                    page: 1,
                }
            );
            const [caption, buttons] = this.showItems(items);
            console.log(buttons);
            ctx.reply(caption, {
                ...Markup.inlineKeyboard(buttons),
            });
        });
        composer.action(/^(CREATE_OFFER_BUTTON.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const array = ctx.update.message.text.split(' ');
            if (array.length !== 5) {
                ctx.reply(
                    'Введено не 5 чисел. \nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const isAllItemsInteger = array.every((item) =>
                Number.isInteger(item)
            );
            if (isAllItemsInteger) {
                ctx.reply(
                    'Не все введённые символы являются цифры.\nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const copperText = ` Медные: ${array[0]}\n`;
            const silverText = `Серебряные: ${array[1]}\n`;
            const electrumText = `Электрумовые: ${array[2]}\n`;
            const goldText = `Золотые: ${array[3]}\n`;
            const platinumText = `Платиновые: ${array[4]}\n`;
            ctx.scene.session.offerAmount.copper = Number.parseInt(array[0]);
            ctx.scene.session.offerAmount.silver = Number.parseInt(array[1]);
            ctx.scene.session.offerAmount.electrum = Number.parseInt(array[2]);
            ctx.scene.session.offerAmount.gold = Number.parseInt(array[3]);
            ctx.scene.session.offerAmount.platinum = Number.parseInt(array[4]);
            const caption =
                `Вы хотите назначить предмету сумму:\n` +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;

            await ctx.reply(caption, {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Да', 'yes')],
                    [Markup.button.callback('Изменить сумму', 'CHANGE_MONEY')],
                    //     [Markup.button.callback('Изменить id', 'CHANGE_ID')],
                    [
                        Markup.button.callback(
                            'Отменить добавление в магазин',
                            'CANCEL_ORDER'
                        ),
                    ],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        composer.action('yes', async (ctx) => {
            await ctx.answerCbQuery();
            const copperText = ` Медные: ${ctx.scene.session.offerAmount.copper}\n`;
            const silverText = `Серебряные: ${ctx.scene.session.offerAmount.silver}\n`;
            const electrumText = `Электрумовые: ${ctx.scene.session.offerAmount.electrum} \n`;
            const goldText = `Золотые: ${ctx.scene.session.offerAmount.gold}\n`;
            const platinumText = `Платиновые: ${ctx.scene.session.offerAmount.platinum}\n`;

            const caption =
                'Товару назначена сумма:' +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;
            await ctx.reply(caption);
            await this.shopService.createOffer({
                itemId: ctx.scene.session.offerAmount.itemId,
                ...ctx.scene.session.offerAmount,
            });
            ctx.scene.session.offerAmount = null;
            
                   moneyLogEntity.sender = `Начислил админ ${dto.adminId.toString()}`;
                moneyLogEntity.copper = dto.copper;
                moneyLogEntity.silver = dto.silver;
                moneyLogEntity.gold = dto.gold;
                moneyLogEntity.electrum = dto.electrum;
                moneyLogEntity.platinum = dto.platinum;
             
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });

        composer.action('CHANGE_MONEY', async (ctx) => {
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.back();
            ctx.wizard.selectStep(1);
        });
        composer.action('CANCEL', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        return composer;
    }

    showItems = (
        items: Paginated<EqupmentItemEntity>
    ): [string, InlineKeyboardButton[][]] => {
        const { data, meta } = items;
        const { currentPage, totalPages, totalItems } = meta;

        const caption = `Предметы`;

        const buttons: InlineKeyboardButton[][] = [];
        for (let i = 0; i < data.length - 1; i += 2) {
            buttons.push([
                Markup.button.callback(data[i].name, `ITEM:${data[i].id}`),
                Markup.button.callback(
                    items.data[i + 1].name,
                    `ITEM:${data[i + 1].id}`
                ),
            ]);
        }

        if (totalPages == 0) {
            buttons.push([
                Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
            ]);
        } else if (currentPage == 1 && totalPages == 1) {
            buttons.push([
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    ENUM_ACTION_NAMES.PAGE_ACTION
                ),
            ]);
        } else if (currentPage == 1 && meta.totalPages > 1) {
            buttons.push([
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    ENUM_ACTION_NAMES.PAGE_ACTION
                ),
                Markup.button.callback(
                    `>>`,
                    `${ENUM_ACTION_NAMES.ITEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
                ),
            ]);
        } else if (currentPage == totalPages) {
            buttons.push([
                Markup.button.callback(
                    `<<`,
                    `${ENUM_ACTION_NAMES.ITEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
                ),
                Markup.button.callback(
                    `${meta.currentPage} из ${meta.totalPages}`,
                    `PAGE`
                ),
            ]);
        } else {
            buttons.push([
                Markup.button.callback(
                    `<<`,
                    `${ENUM_ACTION_NAMES.ITEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
                ),
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    `PAGE`
                ),
                Markup.button.callback(
                    `>>`,
                    `${ENUM_ACTION_NAMES.ITEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
                ),
            ]);
        }
        return [caption, buttons];
    };

    async showItem(ctx: BotContext, itemId: string) {
        const item = await this.equipmentItemService.findItemById(itemId);

        let caption = `<strong>${item.name}</strong>\n`;
        caption += `<strong>Редость: </strong> ${convertRarityToText(item.rarity)}\n`;
        caption += `<strong>Часть тела: </strong> ${convertBodyPartToText(item.bodyPart)}\n`;
        caption += `<strong>Категория: </strong>${item.category.name}\n`;
        caption += `<strong>Маг. урон: </strong>${item.magicAttackDamage}\n`;
        caption += `<strong>Физ. урон: </strong>${item.physicalAttackDamage}\n`;
        caption += `<strong>Магическая защита: </strong>${item.magicDefense}\n`;
        caption += `<strong>Физическая защита: </strong>${item.physicalDefense}\n`;
        caption += `<strong>Описание</strong>\n${item.description}\n`;
        const buttons = [];
        buttons.push([
            Markup.button.callback(
                CREATE_OFFER_BUTTON,
                `CREATE_OFFER_BUTTON:${CREATE_OFFER_BUTTON}`
            ),
        ]);
        buttons.push([Markup.button.callback(BACK_BUTTON, BACK_BUTTON)]);
        await ctx.deleteMessage();
        const avatar = `${process.env.APP_API_URL}/Assets/images/items/${itemId}/${item.image}`;

        await ctx.replyWithPhoto(
            {
                source:
                    fs.existsSync(avatar) && fs.lstatSync(avatar).isFile()
                        ? avatar
                        : SHOP_IMAGE_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
}*/
