import { Action, Context, Message, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { HELLO_IMAGE_PATH, INVENTORY_IMAGE_PATH, KNIGHT_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../../constants/language.text.constant';

@Wizard(SceneIds.characterParameters)
@UseFilters(TelegrafExceptionFilter)
export class CharacterParametersWizard {
    constructor(private readonly tgBotService: TgBotService) {}

    // STEP - 1 start travel
    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        const caption = 'Характеристики персонажа';
        await ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.inlineKeyboard([
                    Markup.button.callback(
                        ctx.i18n.t(LanguageTexts.back),
                        ctx.i18n.t(LanguageTexts.back)
                    ),
                ]),
            }
        );
        ctx.wizard.next();
    }

    @WizardStep(2)
    @Action('Назад')
    //@UseInterceptors(TgBotLoggerInterceptor)
    async back(@Context() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
}
