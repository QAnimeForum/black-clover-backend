import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    ALL_GOODS_BUTTON,
    BACK_BUTTON,
    CREATE_ITEM_BUTTON,
    CREATE_OFFER_BUTTON,
    DELETE_OFFER_BUTTON,
    GOODS_BUTTON,
    GOODS_BY_CATEOGORY_BUTTON,
    GOODS_BY_RARITY_BUTTON,
    OFFERS_BUTTON,
    SHOP_STATISTICS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { EqupmentItemEntity } from 'src/modules/items/entity/equpment.item.entity';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { ShopService } from 'src/modules/items/service/shop.service';
import { ShopEntity } from 'src/modules/items/entity/shop.entity';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { convertBodyPartToText, convertRarityToText } from 'src/modules/tg-bot/utils/items.utils';

@Scene(ENUM_SCENES_ID.SHOP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ShopScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly shopService: ShopService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Магазин';
        if (ctx.chat.type == 'private') {
            if (ctx.session.itemId) {
                await this.showItem(ctx, ctx.session.itemId);
                ctx.session.itemId = null;
            } else {
                await ctx.replyWithPhoto(
                    {
                        source: KNIGHT_IMAGE_PATH,
                    },
                    {
                        caption:
                            'Добро пожаловать в магазин! Происходит загрузка предложений...',
                        ...Markup.keyboard([
                            [SHOP_STATISTICS_BUTTON, GOODS_BUTTON],
                            [CREATE_ITEM_BUTTON, OFFERS_BUTTON],
                            [BACK_BUTTON],
                        ]).resize(),
                    }
                );
            }
            /**
             *      Markup.button.callback('Создать предложение в магазине', 'create_offer'),
        Markup.button.callback('Удалить предложение в магазине', 'delete_offer'),],
             */
        } else {
            ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
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

    @Hears(OFFERS_BUTTON)
    async offers(@Ctx() ctx: BotContext) {
        const offers =
            await this.equipmentItemService.findAllEquipmentItemsNotOnShop({
                path: '',
            });
        console.log(offers);
        /* await this.showOffer(ctx, offers, 1);*/
    }
    @Hears(GOODS_BUTTON)
    async goodsButton(@Ctx() ctx: BotContext) {
        await ctx.replyWithHTML(
            'Список товаров',
            Markup.inlineKeyboard([
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
            ])
        );
    }

    @Action(GOODS_BY_RARITY_BUTTON)
    async goodsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        await ctx.deleteMessage();
        await ctx.reply('Выберите редкость товара', {
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
                        'Эпичные',
                        `RARITY:${ENUM_ITEM_RARITY.EPIC}`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Легендарые',
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
        });
    }
    @Action(/^(RARITY.*)$/)
    async showItemsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const rarity = ctx.callbackQuery['data'].split(':')[1];
        const items = await this.equipmentItemService.findAllEquipmentItems({
            path: '',
            filter: {
                rarity: `$eq:${rarity}`,
            },
        });
        console.log(items);
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
        await ctx.replyWithHTML('Предметы', {
            ...Markup.inlineKeyboard(buttons),
        });
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
        await ctx.reply('Выберите категорию товара', {
            ...Markup.inlineKeyboard(buttons),
        });
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
                        `CATEGORY_ID:${categories.id}`
                    ),
                ]);
                await ctx.deleteMessage();
                await ctx.replyWithHTML('Предметы', {
                    ...Markup.inlineKeyboard(buttons),
                });
            }
        }
    }

    @Action(/^(RARITY_ITEM_ID.*)$/)
    async rarityItem(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        this.showItem(ctx, itemId);
    }

    @Action(/^(CATEGORY_ITEM_ID.*)$/)
    async categoryItem(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        this.showItem(ctx, itemId);
    }

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
        caption += `<strong>Описание</strong>${item.description}\n`;
        const buttons = [];
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `CATEGORY_ID:${item.category.id}`
            ),
        ]);
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(/^(CREATE_OFFER_BUTTON.*)$/)
    async createOffer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        ctx.session.itemId = ctx.callbackQuery['data'].split(':')[1];
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID);
    }

    @Action(/^(DELETE_OFFER_BUTTON.*)$/)
    async deleteOffer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        await this.shopService.makeOfferNotActive(itemId);
        await this.showItem(ctx, ctx.session.itemId);
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

    /*   @Action(/^(PREV_ITEM.*)$/)
    async prevItem(@Ctx() ctx: BotContext) {
        await this.showOffer(ctx, offers_displayed, formState.num);
    }

    @Action(/^(NEXT_ITEM.*)$/)
    async nextItem(@Ctx() ctx: BotContext) {
        await this.showOffer(ctx, offers_displayed, formState.num);
        if (formState.num + 1 > offers_displayed.length) {
            return;
        }

        formState.num++;

        this.showOffer(ctx, offers_displayed, formState.num);
    }*/

    async showOffer(
        ctx: BotContext,
        offers: Paginated<ShopEntity>,
        offerIndex: number
    ) {
        const data = offers.data;
        const { totalItems } = offers.meta;
        if (totalItems == 0) {
            await ctx.replyWithPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption: 'Предложений пока нет.',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                CREATE_OFFER_BUTTON,
                                CREATE_OFFER_BUTTON
                            ),
                        ],
                    ]),
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
                [{ text: 'Вернуться в меню', callback_data: 'open_menu' }],
            ],
        };

        inline_keyboard.inline_keyboard.unshift([
            { text: 'Купить за деньги', callback_data: 'buy_with_money' },
        ]);

        if (offerIndex == 1) {
            await ctx.replyWithPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption:
                        '🛍️ Для вас сегодня есть <b>' +
                        totalItems +
                        '</b> предложений:\n\n⌨ Название предмета: <b>' +
                        data[offerIndex - 1].item.name +
                        '</b>\n👊🏼 Сила: <b> ' +
                        '</b>\n💎 Цены: <b>' +
                        +'</b>\n👚 Надевается в слот: <b>' +
                        data[offerIndex - 1].item.bodyPart +
                        '</b>\n📃 Описание: <b>' +
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
                    media: KNIGHT_IMAGE_PATH,
                    //     media: offers[offerIndex - 1].image,
                    type: 'photo',
                    caption:
                        '🛍️ Для вас сегодня есть <b>' +
                        totalItems +
                        '</b> предложений:\n\n⌨ Название предмета: <b>' +
                        data[offerIndex - 1].item.name +
                        '</b>\n👊🏼 Сила: <b> ' +
                        '</b>\n💎 Цены: <b>' +
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
