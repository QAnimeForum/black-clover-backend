import {
    Ctx,
    Message,
    On,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';

import { UseFilters } from '@nestjs/common';
import { SceneIds } from '../../../constants/scenes.id';
import { BotContext } from '../../../interfaces/bot.context';
import { GrimoireService } from 'src/app/modules/grimoire/services/grimoire.service';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BUTTON_ACTIONS } from '../../../constants/actions';

@Wizard(SceneIds.grimoireEditMagicName)
@UseFilters(TelegrafExceptionFilter)
export class EditGrimoireMagicNameWizard {
    constructor(private readonly grimoireService: GrimoireService) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(`Редактировать магию`);
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
