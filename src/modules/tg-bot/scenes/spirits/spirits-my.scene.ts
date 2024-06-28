import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SPIRITS_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BACK_BUTTON } from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Scene(ENUM_SCENES_ID.MY_SPIRITS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MySpiritsScene {
    constructor() {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'мои духи';
        await ctx.sendPhoto(
            {
                source: SPIRITS_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([[BACK_BUTTON]]).resize(),
            }
        );
    }

    @Hears(BACK_BUTTON)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
