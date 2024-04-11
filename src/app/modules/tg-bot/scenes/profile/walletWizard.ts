import {
    Action,
    Context,
    Message,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { MONEY_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../../constants/language.text.constant';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { UserService } from 'src/app/modules/user/services/user.service';

@Wizard(SceneIds.wallet)
@UseFilters(TelegrafExceptionFilter)
export class WalletWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
    ) {}
    // STEP - 1
    @SceneEnter()
    async start(@Context() ctx: BotContext, @Sender() sender) {
        const user = await this.characterService.getWalletByCharacter(
            sender.id
        );
        const wallet = user.character.wallet;
        const cash = wallet.cash;
        const caption = `Ниличные\n Медные: ${cash.cooper}\n;Серебряные: ${cash.silver}\nЭлектрумовые${cash.eclevtrum}\nЗолотые: ${cash.gold}\nПлатиновые: ${cash.platinum}\n\n`;
        await ctx.sendPhoto(
            {
                source: MONEY_IMAGE_PATH,
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
