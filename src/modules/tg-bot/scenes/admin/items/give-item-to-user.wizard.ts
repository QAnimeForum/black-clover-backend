import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Logger } from 'winston';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import {
    BACK_BUTTON,
    EQUIPMENT_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { SHOP_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    childrenCategoriesButtons,
    itemInformation,
    itemInformationForIssuance,
    parentCategoriesButtons,
} from 'src/modules/tg-bot/utils/items.utils';
import { UserService } from 'src/modules/user/services/user.service';
import fs from 'fs';
import { ShopService } from 'src/modules/items/service/shop.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
@Injectable()
export class GiveEquipmentItemWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly inventoryService: InventoryService,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly userService: UserService,
        private readonly shopService: ShopService
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.GIVE_ITEM_SCENE_ID,
            this.step1(),
            this.step2()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.itemIssued = {
                itemId: '',
                tgUserId: '',
            };
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
        };
    }

    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/^(CATEGORY_ID.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const categoryId = ctx.callbackQuery['data'].split(':')[1];
            if (categoryId == 'null') {
                const categories =
                    await this.equipmentItemService.findCategories();
                const buttons = parentCategoriesButtons(categories);
                buttons.push([
                    Markup.button.callback(BACK_BUTTON, EQUIPMENT_BUTTON),
                ]);
                await ctx.deleteMessage();
                await ctx.sendPhoto(
                    {
                        source: SHOP_IMAGE_PATH,
                    },
                    {
                        caption: 'Выберите категорию товара',
                        ...Markup.inlineKeyboard(buttons),
                    }
                );
            } else {
                const categories =
                    await this.equipmentItemService.findCategoriesByRoot(
                        categoryId
                    );
                const children = categories.children;
                let buttons = [];
                if (children.length > 0) {
                    buttons = childrenCategoriesButtons(categories);
                } else {
                    const items =
                        await this.equipmentItemService.findAllEquipmentItems({
                            path: '',
                            filter: {
                                categoryId: `$eq:${categories.id}`,
                            },
                        });
                    for (let i = 0; i < items.data.length; ++i) {
                        buttons.push([
                            Markup.button.callback(
                                items.data[i].name,
                                `CATEGORY_ITEM_ID:${items.data[i].id}`
                            ),
                        ]);
                    }
                    buttons.push([
                        Markup.button.callback(
                            BACK_BUTTON,
                            `CATEGORY_ID:${categories.parentId}`
                        ),
                    ]);
                }
                await ctx.deleteMessage();
                await ctx.sendPhoto(
                    {
                        source: SHOP_IMAGE_PATH,
                    },
                    {
                        caption: 'Предметы',
                        ...Markup.inlineKeyboard(buttons),
                    }
                );
            }
        });
        composer.action(/^(CATEGORY_ITEM_ID.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const itemId = ctx.callbackQuery['data'].split(':')[1];
            const isAdmin = await this.userService.isAdmin(
                ctx.update.callback_query.from.id.toString()
            );
            await this.showItem(ctx, itemId, isAdmin);
        });

        composer.action(/^(GIVE_ITEM_BUTTON.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                ctx.scene.session.itemIssued.itemId =
                    ctx.callbackQuery['data'].split(':')[1];
            } catch (err) {
                console.log(err);
            }
            await ctx.reply('Введите id пользователя.');
            ctx.wizard.next();
        });

        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Сохранён черновик заклинания.');

            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.itemIssued.tgUserId = ctx.update.message.text;
            const result = await this.inventoryService.giveInventoryItemToUser(
                ctx.scene.session.itemIssued.tgUserId,
                ctx.scene.session.itemIssued.itemId
            );
            console.log(result);
            const item = this.equipmentItemService.findItemById(
                ctx.scene.session.itemIssued.itemId
            );
            await ctx.telegram.sendMessage(
                ctx.scene.session.itemIssued.tgUserId,
                `Вам выдали предмет: ` + (await item).name
            );
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        return composer;
    }

    async showItem(ctx: BotContext, itemId: string, isAdmin: boolean) {
        const item = await this.equipmentItemService.findItemById(itemId);
        const [caption, buttons] = itemInformationForIssuance(item, isAdmin);
        await ctx.deleteMessage();
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${itemId}/${item.image}`;

        await ctx.replyWithPhoto(
            {
                source:
                    fs.existsSync(itemImage) && fs.lstatSync(itemImage).isFile()
                        ? itemImage
                        : SHOP_IMAGE_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
}

/**
 * composer.action(/^(YES.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                ctx.scene.session.item.categoryId =
                    ctx.callbackQuery['data'].split(':')[1];
            } catch (err) {
                console.log(err);
            }
            await ctx.reply('Введите id пользователя.');
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
 */
