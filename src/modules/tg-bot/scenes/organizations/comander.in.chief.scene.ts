import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { MINES_PATH, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { MineService } from '../../../mines/services/mine.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MINE_DEFAULT_PER_PAGE } from 'src/modules/mines/constants/mine.list.constant';
import {
    BACK_BUTTON,
    CREATE_SQUAD_BUTTON,
    MINERALS_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
    TREASURY_BUTTON,
} from '../../constants/button-names.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Scene(ENUM_SCENES_ID.COMMANDER_IN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CommanderInChiefScene {
    constructor(
        private readonly tgBotService: TgBotService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        await ctx.reply('меню', {
            ...Markup.keyboard([
                [TREASURY_BUTTON, CREATE_SQUAD_BUTTON],
                [SHOW_SQUAD_REQUESTS_BUTTON, PEOPLE_MANAGEMENT_BUTTON],
                [BACK_BUTTON],
            ])
                .resize()
                .oneTime(),
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
    }
}
