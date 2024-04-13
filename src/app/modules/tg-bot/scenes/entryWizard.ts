import { Context, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { TgBotService } from '../services/tg-bot.service';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { SceneIds } from '../constants/scenes.id';
import { UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { UserService } from '../../user/services/user.service';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../constants/language.text.constant';
@Wizard(SceneIds.entry)
@UseFilters(TelegrafExceptionFilter)
export class EntryWizard {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly userService: UserService
    ) {}

    // STEP - 1 start travel
    @WizardStep(1)
    async step1(@Context() ctx: BotContext, @Sender() sender) {
        const telegramUserId = sender.id;
        console.log(telegramUserId);
        const isUserExist = await this.userService.exists(telegramUserId);
        if (isUserExist) {
            await ctx.scene.enter(SceneIds.home);
            return;
        }
        const caption = ctx.i18n.t(LanguageTexts.entry);
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Начать путешествие',
                            SceneIds.createCharacter
                        ),
                    ],
                ]),
            }
        );
        ctx.wizard.next();
    }

    // STEP - 2 Choose name
    @WizardStep(2)
    //@UseInterceptors(TgBotLoggerInterceptor)
    async step2(@Context() ctx: BotContext) {
        switch (ctx.updateType) {
            case 'callback_query':
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    return ctx.scene.enter(ctx.callbackQuery.data);
                } else ctx.scene.leave();
            case 'message':
                ctx.scene.leave();
            case 'inline_query':
                ctx.scene.leave();
        }
        ctx.scene.leave();
    }
}
