import {
    Action,
    Context,
    Message,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { HELLO_IMAGE_PATH, INVENTORY_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../../constants/language.text.constant';
import { CharacterService } from 'src/app/modules/character/services/character.service';

@Wizard(SceneIds.inventory)
@UseFilters(TelegrafExceptionFilter)
export class InventoryWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService
    ) {}

    // STEP - 1
    @SceneEnter()
    async start(@Context() ctx: BotContext, @Sender() sender) {

      //  const inventory = await this.characterService.getIn();
      const caption = 'ваш инвентарь';
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption: caption,
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
