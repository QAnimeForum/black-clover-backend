import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { DEVILS_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';

import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { BACK_BUTTON } from '../../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.MY_DEVILS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MyDevilsScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'мои дьяволы';
        await ctx.sendPhoto(
            {
                source: DEVILS_IMAGE_PATH,
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
