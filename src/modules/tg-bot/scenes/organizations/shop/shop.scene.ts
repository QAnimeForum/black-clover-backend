import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { BACK_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { EqupmentItemEntity } from 'src/modules/items/entity/equpment.item.entity';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Scene(ENUM_SCENES_ID.SHOP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ShopScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Магазин';
        if (ctx.chat.type == 'private') {
            await ctx.replyWithPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption:
                        'Добро пожаловать в магазин! Происходит загрузка предложений...',
                    ...Markup.keyboard([[BACK_BUTTON]]).resize(),
                }
            );
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
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
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

    showOffer(
        ctx: BotContext,
        offers: Paginated<EqupmentItemEntity>,
        offerIndex: number
    ) {
        const data = offers.data;
        const { totalItems } = offers.meta;
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

        if (offers[offerIndex - 1].currency_type === 'both') {
            inline_keyboard.inline_keyboard.unshift(
                [{ text: 'Купить за деньги', callback_data: 'buy_with_money' }],
                [
                    {
                        text: 'Купить за золото',
                        callback_data: 'buy_with_rm_currency',
                    },
                ]
            );
        } else if (offers[offerIndex - 1].currency_type === 'money') {
            inline_keyboard.inline_keyboard.unshift([
                { text: 'Купить за деньги', callback_data: 'buy_with_money' },
            ]);
        } else if (offers[offerIndex - 1].currency_type === 'rm_currency') {
            inline_keyboard.inline_keyboard.unshift([
                {
                    text: 'Купить за золото',
                    callback_data: 'buy_with_rm_currency',
                },
            ]);
        }

        ctx.telegram.editMessageMedia(
            ctx.chat?.id,
            undefined,
            undefined,
            {
                media: offers[offerIndex - 1].picture,
                type: 'photo',
                caption:
                    '🛍️ Для вас сегодня есть <b>' +
                    totalItems +
                    '</b> предложений:\n\n⌨ Название предмета: <b>' +
                    data[offerIndex - 1].name +
                    '</b>\n👊🏼 Сила: <b> ' +
                    '</b>\n💎 Цены: <b>' +
                    +'</b>\n👚 Надевается в слот: <b>' +
                    data[offerIndex - 1].bodyPart +
                    '</b>\n📃 Описание: <b>' +
                    data[offerIndex - 1].description +
                    '</b>',
                parse_mode: 'HTML',
            },
            { reply_markup: inline_keyboard }
        );
    }
}
