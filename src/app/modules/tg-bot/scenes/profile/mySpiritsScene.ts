import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { SPIRITS_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { BUTTON_ACTIONS } from '../../constants/actions';

@Scene(SceneIds.mySpirits)
@UseFilters(TelegrafExceptionFilter)
export class MySpiritsScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const caption = 'мои духи';
        await ctx.sendPhoto(
            {
                source: SPIRITS_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([[BUTTON_ACTIONS.back]]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
}
