import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { MapService } from '../../../map/service/map.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Logger } from 'winston';
import {
    BACK_BUTTON,
    BAR_BUTTON,
    BLACK_MARKET_BUTTON,
    CASINO_BUTTON,
    SHOP_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';

@Scene(ENUM_SCENES_ID.SHOPPING_DISTRICT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ShoppingDistrictScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const type = ctx.chat.type;
        if (type == 'private') {
            await ctx.reply(
                'Добро пожаловать в торговый квартал!\n\nЗдесь вы можете обзовестись новыми вещами или заработать, продав собственные',
                {
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [SHOP_BUTTON, BLACK_MARKET_BUTTON],
                        [BAR_BUTTON, CASINO_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.reply(
                'Добро пожаловать в торговый квартал!\n\nЗдесь вы можете обзовестись новыми вещами или заработать, продав собственные',
                {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                SHOP_BUTTON,
                                ENUM_ACTION_NAMES.SHOP_ACTION
                            ),
                            Markup.button.callback(
                                BLACK_MARKET_BUTTON,
                                ENUM_ACTION_NAMES.BLACK_MARKET_ACTION
                            ),
                        ],
                        [
                            Markup.button.callback(
                                BAR_BUTTON,
                                ENUM_ACTION_NAMES.BAR_ACTION
                            ),
                            Markup.button.callback(
                                CASINO_BUTTON,
                                ENUM_ACTION_NAMES.CASINO_ACTION
                            ),
                        ],
                        [
                            Markup.button.callback(
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_ORGANIZATIONS_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(SHOP_BUTTON)
    async shopHears(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.SHOP_ACTION)
    async shopAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
    }
    @Hears(BLACK_MARKET_BUTTON)
    async blackMarketHears(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.BLACK_MARKET_ACTION)
    async blackMarketAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
    }

    @Hears(CASINO_BUTTON)
    async casinoHears(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CASINO_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.CASINO_ACTION)
    async casinoAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.CASINO_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.BAR_ACTION)
    async barAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.BAR_SCENE_ID);
    }
    @Hears(BAR_BUTTON)
    async barHears(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BAR_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_ORGANIZATIONS_ACTION)
    async homeAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async homeHears(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
