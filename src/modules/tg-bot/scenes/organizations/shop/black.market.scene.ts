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
    BACK_BUTTON,
    CHECK_OFFERS_BUTTON,
    CREATE_OFFER_BUTTON,
    MY_OFFERS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';

@Scene(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class BLackMarketScene {
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
                        [CHECK_OFFERS_BUTTON, CREATE_OFFER_BUTTON],
                        [MY_OFFERS_BUTTON, BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                CHECK_OFFERS_BUTTON,
                                ENUM_ACTION_NAMES.CHECK_OFFERS_ACTION
                            ),
                            Markup.button.callback(
                                CREATE_OFFER_BUTTON,
                                ENUM_ACTION_NAMES.CREATE_MARKET_OFFER_ACTION
                            ),
                        ],
                        [
                            Markup.button.callback(
                                MY_OFFERS_BUTTON,
                                ENUM_ACTION_NAMES.MY_OFFERS_ACTION
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

    
    @Hears(CHECK_OFFERS_BUTTON)
    async checkOffers(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.CHECK_OFFERS_SCENE_ID);
    }

    @Hears(CREATE_OFFER_BUTTON)
    async createOffer(@Ctx() ctx: BotContext){
        ctx.scene.enter(ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID);
    }

    @Hears(MY_OFFERS_BUTTON)
    async myOffers(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.MY_OFFERS_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION)
    async backAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
