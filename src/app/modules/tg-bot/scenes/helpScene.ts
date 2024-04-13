import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../constants/actions';
import { KNIGHT_IMAGE_PATH } from '../constants/images';
import { SceneIds } from '../constants/scenes.id';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { BotContext } from '../interfaces/bot.context';
import { TgBotService } from '../services/tg-bot.service';

@Scene(SceneIds.help)
@UseFilters(TelegrafExceptionFilter)
export class HelpScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Помощь';
       /* ctx.reply('полные правила вы можете посмотреть ниже', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Ссылка на QFourum',
                            url: SAMPLE_SPELL_URL,
                        },
                    ],
                    [
                        {
                            text: 'Ссылка на правила',
                            url: SAMPLE_SPELL_URL,
                        },
                    ],
                ],
            },
        });*/
        ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([[BUTTON_ACTIONS.back]]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
}
