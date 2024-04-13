import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { KNIGHT_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';

@Scene(SceneIds.ADMIN)
@UseFilters(TelegrafExceptionFilter)
export class AdminScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Админская панель';
        ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.admin.PERMITIONS,
                        BUTTON_ACTIONS.admin.GRIMOIRE_REQUESTS,
                    ],
                    [
                        BUTTON_ACTIONS.admin.ANNOUNCEMENTS,
                        BUTTON_ACTIONS.admin.EVENTS,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
    @Hears(BUTTON_ACTIONS.grimoire)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoire);
    }
}
