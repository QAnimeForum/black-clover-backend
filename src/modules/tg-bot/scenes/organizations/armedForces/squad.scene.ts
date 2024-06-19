import { UseFilters, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import {
    MEMBER_LIST_BUTTON,
    SQUAD_CONTOL_BUTTON,
    BACK_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ARMED_FORCES } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TgBotService } from 'src/modules/tg-bot/services/tg-bot.service';
import { Markup } from 'telegraf';
import { Logger } from 'typeorm';

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
