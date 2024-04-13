import {
    Ctx,
    InjectBot,
    Message,
    On,
    SceneEnter,
    Sender,
    TELEGRAF_STAGE,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';

import { UseFilters } from '@nestjs/common';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { LanguageTexts } from '../../../constants/language.text.constant';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { TgBotService } from '../../../services/tg-bot.service';
import { GrimoireService } from 'src/app/modules/grimoire/services/grimoire.service';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BUTTON_ACTIONS } from '../../../constants/actions';

@Wizard(SceneIds.grimoireEditMagicName)
@UseFilters(TelegrafExceptionFilter)
export class EditGrimoireMagicNameWizard {
    constructor(private readonly grimoireService: GrimoireService) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(ctx.i18n.t(LanguageTexts.grimoire_new_magic));
    }

    @WizardStep(1)
    @On(['text'])
    //@UseInterceptors(TgBotLoggerInterceptor)
    async changeName(
        @Ctx() ctx: BotContext,
        @Sender() sender,
        @Message('text') msg: string
    ) {
        if (Object.values(BUTTON_ACTIONS).includes(msg)) {
            ctx.reply('Введите название магии, а не команду');
            ctx.wizard.back();
            return;
        }
        const grimoire = await this.grimoireService.findGrimoireByUserId(
            sender.id
        );
        await this.grimoireService.updateGrimoreMagicName(grimoire.id, {
            magicName: msg,
        });
        await ctx.scene.enter(SceneIds.grimoire);
    }
}
