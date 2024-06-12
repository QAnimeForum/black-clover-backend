import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { BotContext } from '../interfaces/bot.context';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
import {
    BACK_BUTTON,
    GUIDES_BUTTON,
    KNOWLEGE_BASE_BUTTON,
} from '../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Scene(ENUM_SCENES_ID.HELP_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class HelpScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption =
            '❓ Помощь\n Этот бот предназначен для игры в мире, основанном на манге чёрный клевер. Если хочешь узнать больше или что то не понятно, пиши в чат QForum, @sanscri  или читай 📚 Гайды.';
        ctx.reply(caption, {
            ...Markup.keyboard([
                [KNOWLEGE_BASE_BUTTON, GUIDES_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
}
