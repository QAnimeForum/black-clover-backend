import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
    ARMED_FORCES,
    MINES_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../../constants/images';
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
    MEMBER_LIST_BUTTON,
    MINERALS_BUTTON,
    SQUAD_CONTOL_BUTTON,
} from '../../constants/button-names.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Scene(ENUM_SCENES_ID.SQUAD_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class SquadScene {
    constructor(
        private readonly tgBotService: TgBotService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = `<strong>🛡️Ваш клан:</strong>\n<strong>Количество участников:</strong>\n<strong>Ваш ранг:</strong>\n<strong>Ваша должность:</strong>`;

        ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [MEMBER_LIST_BUTTON],
                    [SQUAD_CONTOL_BUTTON],
                    [BACK_BUTTON],
                ])
                    .resize()
                    .oneTime(),
            }
        );
    }

    @Hears(SQUAD_CONTOL_BUTTON)
    async squadControl(@Ctx() ctx: BotContext) {
        ctx.reply('Разделяй и властвуй', {
            reply_markup: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        '📝Изменить информацию об отряде',
                        `CHANGE_SQUAD_INFORMATION`
                    ),
                ],
                [
                    Markup.button.callback(
                        '✅Назначить на должность',
                        `APPOINT_AS`
                    ),
                ],
                [
                    Markup.button.callback(
                        '❌Снять с должности',
                        `REMOVE_FROM_POST`
                    ),
                ],
                [Markup.button.callback('✅Принять в отряд', 'JOIN_TO_SQUAD')],
                [
                    Markup.button.callback(
                        '❌Изгнать из отряда',
                        `EXCLUSION_FROM_THE_SQUAD`
                    ),
                ],
            ]),
        });
    }

    @Hears(MEMBER_LIST_BUTTON)
    async memberList(@Ctx() ctx: BotContext) {
        const caption = 'Список участников отряда';
        await ctx.reply(caption);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
    }
}
