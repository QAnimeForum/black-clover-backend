import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { PARLAMENT } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';

@Scene(SceneIds.magicParlament)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor() {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const title = `<strong><u>Магический парламент</u></strong>`;
        const workingHours = `<strong>Время работы</strong>\nЗаявки можно подавать круглосуточно. Будут рассматриваться по мере возможности.`;
        const allCourtCase = `<strong>Количество всех дел</strong>:`;
        const myCourtCase = `<strong>Количество моих заявок в суд</strong>:`;
        const yourAllFines = `<strong>Количество всех штрафов</strong>:`;
        const yourCurrentFines = `<strong>Количество текущих штрафов</strong>:`;
        const priazonStatus = `<strong>Находитесь ли вы в тюрьме</strong>: нет`;
        const caption = `${title}\n\n${workingHours}\n\n${allCourtCase}\n${myCourtCase}\n${yourAllFines}\n${yourCurrentFines}\n${priazonStatus}\n`;
        ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.ALL_COURY_CASE,
                        BUTTON_ACTIONS.MY_COURY_CASE,
                    ],
                    [
                        BUTTON_ACTIONS.REQUEST_TO_PARLAMENT,
                        BUTTON_ACTIONS.PRIAZON,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }
}
