import { Context, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { HELLO_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';

@Wizard(SceneIds.wallet)
@UseFilters(TelegrafExceptionFilter)
export class WalletWizard {
    constructor(private readonly tgBotService: TgBotService) {}

    // STEP - 1 start travel
    @WizardStep(1)
    async step1(@Context() ctx: BotContext) {
        const caption = ctx.i18n.t('entry');
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Начать путешествивие',
                                callback_data: SceneIds.createCharacter,
                            },
                        ],
                    ],
                },
            }
        );
        ctx.wizard.next();
    }

    // STEP - 2 Choose name
    @WizardStep(2)
    //@UseInterceptors(TgBotLoggerInterceptor)
    async step2(@Context() ctx: BotContext, @Message('text') msg: string) {
        ctx.scene.leave();
    }
}
