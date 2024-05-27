import {
    Ctx,
    Message,
    On,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';

import { Inject, UseFilters } from '@nestjs/common';
import { BotContext } from '../../../interfaces/bot.context';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Wizard(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MagicNameEditWizard {
    constructor(private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(`Редактировать магию`);
    }

    @WizardStep(1)
    @On(['text'])
    //@UseInterceptors(TgBotLoggerInterceptor)
    async changeName(
        @Ctx() ctx: BotContext,
        @Sender('id') tgId,
        @Message('text') msg: string
    ) {
        /*   if (Object.values(BUTTON_ACTIONS).includes(msg)) {
            ctx.reply('Введите название магии, а не команду');
            ctx.wizard.back();
            return;
        }*/
        const grimoire =
            await this.grimoireService.findGrimoireByUserTgId(tgId);
        await this.grimoireService.updateGrimoreMagicName(grimoire.id, {
            magicName: msg,
        });
        await ctx.scene.enter(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID);
    }
}
