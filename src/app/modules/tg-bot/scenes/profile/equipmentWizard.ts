import {
    Action,
    Context,
    SceneEnter,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { LanguageTexts } from '../../constants/language.text.constant';
import { Markup } from 'telegraf';
import { INVENTORY_IMAGE_PATH } from '../../constants/images';

@Wizard(SceneIds.equipment)
@UseFilters(TelegrafExceptionFilter)
export class EquipmentWizard {
    constructor(private readonly tgBotService: TgBotService) {}

    // STEP - 1
    @SceneEnter()
    async start(@Context() ctx: BotContext) {
        const caption = ctx.i18n.t('entry');
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
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
