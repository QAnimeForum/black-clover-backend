import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { BotContext } from '../interfaces/bot.context';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
import {
    BACK_BUTTON_NAME,
    GUIDES_BUTTON_NAME,
    KNOWLEGE_BASE_BUTTON_NAME,
} from '../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.HELP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class HelpScene {
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption =
            '❓ Помощь\n Этот бот предназначен для игры в мире, основанном на манге чёрный клевер. Если хочешь узнать больше или что то не понятно, пиши в чат QForum, @sanscri  или читай 📚 Гайды.';
        ctx.reply(caption, {
            ...Markup.keyboard([
                [KNOWLEGE_BASE_BUTTON_NAME, GUIDES_BUTTON_NAME],
                [BACK_BUTTON_NAME],
            ]),
        });
    }

    @Hears(BACK_BUTTON_NAME)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
}
