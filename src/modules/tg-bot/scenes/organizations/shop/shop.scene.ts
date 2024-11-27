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
    EQUIPMENT_BUTTON,
    GOODS_BUTTON,
    GOODS_BY_CATEOGORY_BUTTON,
    GOODS_BY_RARITY_BUTTON,
    RESOURCES_BUTTON,
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
import { showOffers } from 'src/modules/tg-bot/utils/inventory.utils';
import { WalletService } from 'src/modules/money/wallet.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
@Scene(ENUM_SCENES_ID.SHOP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ShopScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly inventoryService: InventoryService,
        private readonly userService: UserService,
        private readonly shopService: ShopService,
        private readonly walletService: WalletService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const caption = 'Магазин';
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (ctx.chat.type == 'private') {
            const buttons = [];

            buttons.push([EQUIPMENT_BUTTON, RESOURCES_BUTTON]);
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

    @Hears(EQUIPMENT_BUTTON)
    async offers(@Ctx() ctx: BotContext) {
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

    @Action(EQUIPMENT_BUTTON)
    async goodsAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
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
                    [Markup.button.callback(BACK_BUTTON, EQUIPMENT_BUTTON)],
                ]),
            }
        );
    }
    @Action(/^(RARITY:.*)$/)
    async showItemsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const rarity = ctx.callbackQuery['data'].split(':')[1];
        const offers = await this.equipmentItemService.findOffers({
            path: '',
            limit: 1,
            page: 1,
            filter: {
                'item.rarity': `$eq:${rarity}`,
            },
        });
        const { data, meta } = offers;
        const { itemsPerPage, currentPage, totalPages, totalItems } = meta;
        let offer: ShopEntity = null;
        let isUserHasEquipmentItem = false;
        let itemImage = '';
        if (itemsPerPage == 1 && totalItems > 0) {
            offer = data[0];
            isUserHasEquipmentItem =
                await this.inventoryService.isUserHasEquipmentItem(
                    offer.itemId
                );
            itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer?.item?.id}/${offer.item.image}`;
        }
        const [caption, buttons] = showOffers(
            offer,
            isUserHasEquipmentItem,
            currentPage,
            totalPages,
            totalItems
        );
        buttons.push([
            Markup.button.callback(BACK_BUTTON, GOODS_BY_RARITY_BUTTON),
        ]);
        await ctx.deleteMessage();

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
        buttons.push([Markup.button.callback(BACK_BUTTON, EQUIPMENT_BUTTON)]);
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
        let isUserHasEquipmentItem = false;
        let itemImage = '';
        if (itemsPerPage == 1 && totalItems > 0) {
            offer = data[0];
            isUserHasEquipmentItem =
                await this.inventoryService.isUserHasEquipmentItem(
                    offer.itemId
                );
            itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer?.item?.id}/${offer.item.image}`;
        }
        const [caption, buttons] = showOffers(
            offer,
            isUserHasEquipmentItem,
            currentPage,
            totalPages,
            totalItems
        );

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
        let isUserHasEquipmentItem = false;
        let itemImage = '';
        if (itemsPerPage == 1 && totalItems > 0) {
            offer = data[0];
            isUserHasEquipmentItem =
                await this.inventoryService.isUserHasEquipmentItem(
                    offer.itemId
                );
            itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer?.item?.id}/${offer.item.image}`;
        }
        const [caption, buttons] = showOffers(
            offer,
            isUserHasEquipmentItem,
            currentPage,
            totalPages,
            totalItems
        );

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
        let isUserHasEquipmentItem = false;
        let itemImage = '';
        if (itemsPerPage == 1 && totalItems > 0) {
            offer = data[0];
            isUserHasEquipmentItem =
                await this.inventoryService.isUserHasEquipmentItem(
                    offer.itemId
                );
            itemImage = `${process.env.APP_API_URL}/Assets/images/items/${offer?.item?.id}/${offer.item.image}`;
        }
        const [caption, buttons] = showOffers(
            offer,
            isUserHasEquipmentItem,
            currentPage,
            totalPages,
            totalItems
        );

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
                    caption: 'Предложений пока нет.'
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
