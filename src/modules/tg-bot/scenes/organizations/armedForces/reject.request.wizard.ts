import {
    Ctx,
    On,
    SceneEnter,
    Wizard,
    WizardStep,
    Message,
    Command,
} from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';

import { SquadsService } from 'src/modules/squards/service/squads.service';

import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ARMED_FORCES_REQUEST } from 'src/modules/squards/constants/armed.forces.request.list';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
@Wizard(ENUM_SCENES_ID.ARMY_REQUEST_REJECT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class RejectrequestWizard {
    constructor(
        private readonly userService: UserService,
        private readonly squadService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи TRADE ID игрока, которого хотите принять в ряды чародеев, защищающих вашу страну.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {
        const isUserExists = await this.userService.exists(message.text);

        if (!isUserExists) {
            ctx.reply(
                'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
            );
            ctx.wizard.back();
        } else {
            /* const tgChatId: string = message.text;
            await this.squadService.rejectRequest(
                message.text,
                ENUM_ARMED_FORCES_REQUEST.REJECTED
            );
            ctx.telegram.sendMessage(
                tgChatId,
                'Вашу заявку в боевые маги не одобрили.'
            );*/
            await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
        }
    }
}
