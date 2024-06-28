import {
    Action,
    Ctx,
    Hears,
    InlineQuery,
    Scene,
    SceneEnter,
} from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    BACK_BUTTON,
    MY_OFFERS_BUTTON,
    SEARCH_OFFERS_BUTTON,
    SEARCH_OFFERS_BY_CATEGORY_BUTTON,
    SEARCH_OFFERS_BY_NAME_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { MarketEntity } from 'src/modules/items/entity/market.entity';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

@Scene(ENUM_SCENES_ID.CHECK_OFFERS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CheckOffersScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption =
            'На рынке игроки могут торговать предметами с друг-другом, выберите интересующую вас опцию.';

        if (ctx.chat.type == 'private') {
            ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [
                            SEARCH_OFFERS_BY_NAME_BUTTON,
                            SEARCH_OFFERS_BY_CATEGORY_BUTTON,
                        ],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            const caption = 'Поиск картинок';
            await ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.switchToCurrentChat(
                                SEARCH_OFFERS_BY_NAME_BUTTON,
                                '#wft'
                            ),
                        ],
                        [
                            {
                                text: SEARCH_OFFERS_BY_CATEGORY_BUTTON,
                                switch_inline_query_current_chat:
                                    SEARCH_OFFERS_BY_CATEGORY_BUTTON,
                                // ENUM_ACTION_NAMES.SEARCH_OFFERS_BY_CATEGORY_ACTION,
                            },
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(SEARCH_OFFERS_BY_NAME_BUTTON)
    async searchByName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.SEARCH_OFFERS_BY_NAME_SCENE_ID);
    }

    @Hears(SEARCH_OFFERS_BY_CATEGORY_BUTTON)
    async searchByCategory(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(
            ENUM_SCENES_ID.SEARCH_OFFERS_BY_CATEGORY_SCENE_ID
        );
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
    }
}
