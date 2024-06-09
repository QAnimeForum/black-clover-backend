import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
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
    ARMED_FORCES_BUTTON,
    BACK_BUTTON,
    BAR_BUTTON,
    BLACK_MARKET_BUTTON,
    CASINO_BUTTON,
    FIELDS_BUTTON,
    MAGIC_PARLAMENT_BUTTON,
    MINES_BUTTON,
    SHOP_BUTTON,
    SHOPPING_DISTRICT_BUTTON,
} from '../../constants/button-names.constant';


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
    }

    @Hears(SHOP_BUTTON)
    async shop(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
    }

    @Hears(BLACK_MARKET_BUTTON)
    async blackMarket(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
    }

    @Hears(CASINO_BUTTON)
    async casino(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CASINO_SCENE_ID);
    }

    @Hears(BAR_BUTTON)
    async bar(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BAR_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
