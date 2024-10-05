import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { SHOP_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    ALL_GOODS_BUTTON,
    BACK_BUTTON,
    CREATE_ITEM_BUTTON,
    CREATE_OFFER_BUTTON,
    DELETE_ITEM,
    EDIT_ITEM_CATEGORY,
    EDIT_ITEM_DESCRIPTION,
    EDIT_ITEM_NAME,
    EDIT_ITEM_PHOTO,
    EDIT_ITEM_RARITY,
    EDIT_ITEM_SLOT,
    EDIT_MAGIC_DAMAGE,
    EDIT_MAGIC_DEFENSE,
    EDIT_PHYSICAL_DAMAGE,
    EDIT_PHYSICAL_DEFENSE,
    GOODS_BUTTON,
    GOODS_BY_CATEOGORY_BUTTON,
    GOODS_BY_RARITY_BUTTON,
    OFFERS_BUTTON,
    SHOP_STATISTICS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { ShopService } from 'src/modules/items/service/shop.service';
import { ShopEntity } from 'src/modules/items/entity/shop.entity';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import {
    convertBodyPartToText,
    convertRarityToText,
} from 'src/modules/tg-bot/utils/items.utils';
import fs from 'fs';
import { UserService } from 'src/modules/user/services/user.service';
import { method } from 'lodash';
import { showOffers } from 'src/modules/tg-bot/utils/inventory.utils';
import { button } from 'telegraf/typings/markup';
import { WalletService } from 'src/modules/money/wallet.service';
@Scene(ENUM_SCENES_ID.SHOP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ShopScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly userService: UserService,
        private readonly shopService: ShopService,
        private readonly walletService: WalletService,
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        //  await this.shopService.createCategories();
        const caption = 'Магазин';
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (ctx.chat.type == 'private') {
            if (ctx.session.itemId) {
                const buttons = [];
                buttons.push([OFFERS_BUTTON, GOODS_BUTTON]);
                if (isAdmin) {
                    buttons.push([CREATE_ITEM_BUTTON, SHOP_STATISTICS_BUTTON]);
                }
                buttons.push([BACK_BUTTON]);
                await ctx.replyWithPhoto(
                    {
                        source: SHOP_IMAGE_PATH,
                    },
                    {
                        caption: 'Вы вернулись в магазин',
                        ...Markup.keyboard(buttons).resize(),
                    }
                );
                await this.showItem(ctx, ctx.session.itemId, isAdmin);
                ctx.session.itemId = null;
            } else {
                const buttons = [];
                buttons.push([OFFERS_BUTTON, GOODS_BUTTON]);
                if (isAdmin) {
                    buttons.push([CREATE_ITEM_BUTTON, SHOP_STATISTICS_BUTTON]);
                }
                buttons.push([BACK_BUTTON]);
                await ctx.replyWithPhoto(
                    {
                        source: SHOP_IMAGE_PATH,
                    },
                    {
                        caption: 'Добро пожаловать в магазин',
                        ...Markup.keyboard(buttons).resize(),
                    }
                );
            }
        } else {
            ctx.sendPhoto(
                {
                    source: SHOP_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                ALL_GOODS_BUTTON,
                                ALL_GOODS_BUTTON
                            ),
                            Markup.button.callback(
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(CREATE_ITEM_BUTTON)
    async createItem(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ITEM_CREATE_SCENE_ID);
    }
    @Hears(OFFERS_BUTTON)
    async offers(@Ctx() ctx: BotContext) {
        const offers = await this.equipmentItemService.findOffers({
            path: '',
            limit: 1,
            page: 1,
        });
        const { data, meta } = offers;
        const { itemsPerPage, currentPage, totalPages, totalItems } = meta;
        let offer: ShopEntity = null;
        if (itemsPerPage == 1) {
            offer = data[0];
        }
        const [caption, buttons] = showOffers(
            offer,
            currentPage,
            totalPages,
            totalItems
        );
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer.item.id}/${offer.item.image}`;

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
    @Hears(GOODS_BUTTON)
    async goodsButton(@Ctx() ctx: BotContext) {
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Список товаров',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            GOODS_BY_CATEOGORY_BUTTON,
                            GOODS_BY_CATEOGORY_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            GOODS_BY_RARITY_BUTTON,
                            GOODS_BY_RARITY_BUTTON
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(GOODS_BY_RARITY_BUTTON)
    async goodsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Выберите редкость товара',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Обычные',
                            `RARITY:${ENUM_ITEM_RARITY.COMMON}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Необычные',
                            `RARITY:${ENUM_ITEM_RARITY.UNCOMMON}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Редкие',
                            `RARITY:${ENUM_ITEM_RARITY.RARE}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Эпические',
                            `RARITY:${ENUM_ITEM_RARITY.EPIC}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Легендарные',
                            `RARITY:${ENUM_ITEM_RARITY.LEGENDARY}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Уникальные',
                            `RARITY:${ENUM_ITEM_RARITY.UNIQUE}`
                        ),
                    ],
                ]),
            }
        );
    }
    @Action(/^(RARITY:.*)$/)
    async showItemsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const rarity = ctx.callbackQuery['data'].split(':')[1];
        const items = await this.equipmentItemService.findAllEquipmentItems({
            path: '',
            filter: {
                rarity: `$eq:${rarity}`,
            },
        });
        const buttons = [];
        for (let i = 0; i < items.data.length; ++i) {
            buttons.push([
                Markup.button.callback(
                    items.data[i].name,
                    `RARITY_ITEM_ID:${items.data[i].id}`
                ),
            ]);
        }
        buttons.push([Markup.button.callback(BACK_BUTTON, `RARITY:${rarity}`)]);
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Товар',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(GOODS_BY_CATEOGORY_BUTTON)
    async goodsByCategory(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
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
    }

    @Action(/^(CATEGORY_ID.*)$/)
    async category(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const categoryId = ctx.callbackQuery['data'].split(':')[1];
        if (categoryId == 'null') {
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
        }
    }

    @Action(/^(RARITY_ITEM_ID:.*)$/)
    async rarityItem(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, itemId, isAdmin);
    }

    @Action(/^(CATEGORY_ITEM_ID.*)$/)
    async categoryItem(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, itemId, isAdmin);
    }

    async showItem(ctx: BotContext, itemId: string, isAdmin: boolean) {
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
        if (isAdmin) {
            const isItemHasOffer = await this.shopService.hasItemOffer(itemId);
            if (!isItemHasOffer) {
                buttons.push([
                    Markup.button.callback(
                        CREATE_OFFER_BUTTON,
                        `CREATE_OFFER_BUTTON:${item.id}`
                    ),
                ]);
            }
            buttons.push([
                Markup.button.callback(
                    EDIT_ITEM_NAME,
                    `EDIT_ITEM_NAME:${item.id}`
                ),
                Markup.button.callback(
                    EDIT_ITEM_DESCRIPTION,
                    `EDIT_ITEM_DESCRIPTION:${item.id}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    EDIT_ITEM_RARITY,
                    `EDIT_ITEM_RARITY:${item.id}`
                ),
                Markup.button.callback(
                    EDIT_ITEM_SLOT,
                    `EDIT_ITEM_SLOT:${item.id}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    EDIT_ITEM_PHOTO,
                    `EDIT_ITEM_PHOTO:${item.id}`
                ),
                Markup.button.callback(
                    EDIT_ITEM_CATEGORY,
                    `EDIT_ITEM_CATEGORY:${item.id}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    EDIT_PHYSICAL_DAMAGE,
                    `EDIT_PHYSICAL_DAMAGE:${item.id}`
                ),
                Markup.button.callback(
                    EDIT_PHYSICAL_DEFENSE,
                    `EDIT_PHYSICAL_DEFENSE:${item.id}`
                ),
            ]);

            buttons.push([
                Markup.button.callback(
                    EDIT_MAGIC_DAMAGE,
                    `EDIT_MAGIC_DAMAGE:${item.id}`
                ),
                Markup.button.callback(
                    EDIT_MAGIC_DEFENSE,
                    `EDIT_MAGIC_DEFENSE:${item.id}`
                ),
            ]);

            buttons.push([
                Markup.button.callback(DELETE_ITEM, `DELETE_ITEM:${item.id}`),
            ]);
        }
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `CATEGORY_ID:${item.category.id}`
            ),
        ]);
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
    @Action(/^(EDIT_ITEM_NAME:.*)$/)
    async editItemName(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_NAME_ITEM_SCENE_ID);
    }
    @Action(/^(EDIT_ITEM_DESCRIPTION:.*)$/)
    async editItemDescription(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_DESCRIPTION_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_RARITY:.*)$/)
    async editItemRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_RARITY_ITEM_SCENE_ID);
    }
    @Action(/^(EDIT_ITEM_SLOT:.*)$/)
    async editSlot(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SLOT_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_PHOTO:.*)$/)
    async editPhoto(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_PHOTO_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_CATEGORY:.*)$/)
    async editItemCategory(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_CATEGORY_ITEM_SCENE_ID);
    }
    @Action(/^(CREATE_OFFER_BUTTON.*)$/)
    async createOffer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        ctx.session.itemId = ctx.callbackQuery['data'].split(':')[1];
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID);
    }

    @Action(/^(BUY:.*)$/)
    async buy(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const offerId = ctx.callbackQuery['data'].split(':')[1];
        const page = ctx.callbackQuery['data'].split(':')[2];
        await ctx.editMessageReplyMarkup({
            inline_keyboard: [
                [
                    Markup.button.callback(
                        'Да, я хочу купить этот предмет',
                        `BUY_YES:${offerId}:${page}`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Я передумал покупать этот предмет',
                        `BUY_NO:${offerId}:${page}`
                    ),
                ],
            ],
        });
        /*await ctx.telegram.editMessageMedia(
            ctx.chat?.id,
            undefined,
            undefined,
            {
                media:
                    fs.existsSync(itemImage) &&
                    fs.lstatSync(itemImage).isFile()
                        ? itemImage
                        : SHOP_IMAGE_PATH,
                //     media: offers[offerIndex - 1].image,
                type: 'photo',
                caption:
                    '',
                parse_mode: 'HTML',
            },
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Да, я хочу купить этот предмет',
                        `BUY_YES:${offerId}:${page}`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Я передумал покупать этот предмет',
                        `BUY_NO:${offerId}:${page}`
                    ),
                ],
            ])
        );*/
    }

    @Action(/^(BUY_YES:.*)$/)
    async buyYes(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        await ctx.answerCbQuery();
        const offerId = ctx.callbackQuery['data'].split(':')[1];
        const page = ctx.callbackQuery['data'].split(':')[2];
        const wallet = await this.walletService.findWalletByUserTgId(tgId);
        const caption = await this.shopService.buy(offerId, tgId);
        await ctx.reply(caption);
    }

    @Action(/^(BUY_NO:.*)$/)
    async buyNo(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const offerId = ctx.callbackQuery['data'].split(':')[1];
        const page = ctx.callbackQuery['data'].split(':')[2];
        const offers = await this.equipmentItemService.findOffers({
            path: '',
            limit: 1,
            page: page,
        });
        const { data, meta } = offers;
        const { itemsPerPage, currentPage, totalPages, totalItems } = meta;
        let offer: ShopEntity = null;
        if (itemsPerPage == 1) {
            offer = data[0];
        }
        const [caption, buttons] = showOffers(
            offer,
            currentPage,
            totalPages,
            totalItems
        );
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer.item.id}/${offer.item.image}`;

        const image =
            fs.existsSync(itemImage) && fs.lstatSync(itemImage).isFile()
                ? itemImage
                : SHOP_IMAGE_PATH;
        await ctx.editMessageMedia({
            type: 'photo',
            media: {
                source: image,
            },
        });
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(SHOP_NEXT_PAGE.*)$/)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const offers = await this.equipmentItemService.findOffers({
            path: '',
            limit: 1,
            page: page,
        });
        const { data, meta } = offers;
        console.log(page);
        const { itemsPerPage, currentPage, totalPages, totalItems } = meta;
        let offer: ShopEntity = null;
        if (itemsPerPage == 1) {
            offer = data[0];
        }
        const [caption, buttons] = showOffers(
            offer,
            currentPage,
            totalPages,
            totalItems
        );
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer.item.id}/${offer.item.image}`;

        const image =
            fs.existsSync(itemImage) && fs.lstatSync(itemImage).isFile()
                ? itemImage
                : SHOP_IMAGE_PATH;
        await ctx.editMessageMedia({
            type: 'photo',
            media: {
                source: image,
            },
        });
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(SHOP_PREVIOUS_PAGE.*)$/)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const offers = await this.equipmentItemService.findOffers({
            path: '',
            limit: 1,
            page: page,
        });
        const { data, meta } = offers;
        console.log(offers);
        const { itemsPerPage, currentPage, totalPages, totalItems } = meta;
        let offer: ShopEntity = null;
        if (itemsPerPage == 1) {
            offer = data[0];
        }
        const [caption, buttons] = showOffers(
            offer,
            currentPage,
            totalPages,
            totalItems
        );
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer.item.id}/${offer.item.image}`;

        const image =
            fs.existsSync(itemImage) && fs.lstatSync(itemImage).isFile()
                ? itemImage
                : SHOP_IMAGE_PATH;
        await ctx.editMessageMedia({
            type: 'photo',
            media: {
                source: image,
            },
        });
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(DELETE_OFFER_BUTTON.*)$/)
    async deleteOffer(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        await this.shopService.makeOfferNotActive(itemId);
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, ctx.session.itemId, isAdmin);
        await ctx.reply('Предложение отмечено как неактивное');
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION)
    async backAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID);
    }

    async showOffer1(
        ctx: BotContext,
        offers: Paginated<ShopEntity>,
        offerIndex: number
    ) {
        const data = offers.data;
        const { totalItems } = offers.meta;
        if (totalItems == 0) {
            await ctx.replyWithPhoto(
                {
                    source: SHOP_IMAGE_PATH,
                },
                {
                    caption: 'Предложений пока нет.',
                    /*  ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                CREATE_OFFER_BUTTON,
                                CREATE_OFFER_BUTTON
                            ),
                        ],
                    ]),*/
                }
            );
        }
        if (offerIndex - 1 < 0 || offerIndex - 1 >= totalItems) {
            return;
        }
        const inline_keyboard: InlineKeyboardMarkup = {
            inline_keyboard: [
                [
                    {
                        text: '<<< (ещё ' + (offerIndex - 1) + ')',
                        callback_data: 'prev_item',
                    },
                    {
                        text: '(ещё ' + (totalItems - offerIndex) + ') >>>',
                        callback_data: 'next_item',
                    },
                ],
            ],
        };

        inline_keyboard.inline_keyboard.unshift([
            {
                text: 'Купить',
                callback_data: `BUY:${data[offerIndex - 1].id}${offerIndex}`,
            },
        ]);

        //  const wallet = character.wallet;
        const copperText = `${data[offerIndex - 1].copper} 🟤`;
        const silverText = `${data[offerIndex - 1].silver} ⚪️`;
        const electrumText = `${data[offerIndex - 1].electrum} 🔵`;
        const goldTextText = `${data[offerIndex - 1].gold} 🟡`;
        const platinumText = `${data[offerIndex - 1].platinum} 🪙`;
        const price = `${platinumText} ${goldTextText} ${electrumText} ${silverText} ${copperText} \n`;

        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${data[offerIndex - 1].item.id}/${data[offerIndex - 1].item.image}`;
        if (offerIndex == 1) {
            await ctx.replyWithPhoto(
                {
                    source:
                        fs.existsSync(itemImage) &&
                        fs.lstatSync(itemImage).isFile()
                            ? itemImage
                            : SHOP_IMAGE_PATH,
                },
                {
                    caption:
                        '🛍️ Для вас сегодня есть <b>' +
                        totalItems +
                        '</b> предложений:\n\n⌨ Название предмета: <b>' +
                        data[offerIndex - 1].item.name +
                        '</b>\n💎 Категория: <b> ' +
                        data[offerIndex - 1].item.category.name +
                        '</b>\n💎 Редкость: <b> ' +
                        convertRarityToText(data[offerIndex - 1].item.rarity) +
                        '</b>\n👚 Слот: <b>' +
                        convertBodyPartToText(
                            data[offerIndex - 1].item.bodyPart
                        ) +
                        '</b>\n\n👊🏼 Физ. урон: <b> ' +
                        data[offerIndex - 1].item.physicalAttackDamage +
                        '</b>\n👊🏼 Маг. урон: <b> ' +
                        data[offerIndex - 1].item.magicAttackDamage +
                        '</b>\n🛡 Физ. защита: <b> ' +
                        data[offerIndex - 1].item.physicalDefense +
                        '</b>\n🛡 Маг. защита: <b> ' +
                        data[offerIndex - 1].item.magicDefense +
                        '</b>\n💴 Цена: <b>' +
                        price +
                        '</b>\n📃 Описание\n <b>' +
                        data[offerIndex - 1].item.description +
                        '</b>',
                    parse_mode: 'HTML',
                    reply_markup: inline_keyboard,
                }
            );
        } else {
            await ctx.telegram.editMessageMedia(
                ctx.chat?.id,
                undefined,
                undefined,
                {
                    media:
                        fs.existsSync(itemImage) &&
                        fs.lstatSync(itemImage).isFile()
                            ? itemImage
                            : SHOP_IMAGE_PATH,
                    //     media: offers[offerIndex - 1].image,
                    type: 'photo',
                    caption:
                        '🛍️ Для вас сегодня есть <b>' +
                        totalItems +
                        '</b> предложений:\n\n⌨ Название предмета: <b>' +
                        data[offerIndex - 1].item.name +
                        '</b>\n👊🏼 Сила: <b> ' +
                        '</b>\n💎 Цена: <b>' +
                        +'</b>\n👚 Надевается в слот: <b>' +
                        data[offerIndex - 1].item.bodyPart +
                        '</b>\n📃 Описание: <b>' +
                        data[offerIndex - 1].item.description +
                        '</b>',
                    parse_mode: 'HTML',
                },
                { reply_markup: inline_keyboard }
            );
        }
    }
}
