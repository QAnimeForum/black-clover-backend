import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../constants/actions';
import { SceneIds } from '../constants/scenes.id';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { BotContext } from '../interfaces/bot.context';
@Scene(SceneIds.help)
@UseFilters(TelegrafExceptionFilter)
export class HelpScene {

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption =
            '❓ Помощь\n Этот бот предназначен для игры в мире, основанном на манге чёрный клевер. Если хочешь узнать больше или что то не понятно, пиши в чат QForum, @sanscri  или читай 📚 Гайды.';
        ctx.reply(caption, {
            ...Markup.keyboard([
                ['🗂 База знаний', '📚 Гайды'],
                [BUTTON_ACTIONS.back],
            ]),
        });
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
}
