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
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';

import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ARMED_FORCES_REQUEST } from 'src/modules/squards/constants/armed.forces.request.list';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';

@Wizard(ENUM_SCENES_ID.ARMY_REQUEST_ACCEPT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AcceptRequestWizard {
    constructor(
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        private readonly squadService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи ID игрока, которого хотите принять в ряды рыцарей-чародеев.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`,
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
            const tgChatId = message.text;
            const character =
                await this.characterService.findCharacterByTgId(tgChatId);
            const armedForces = await this.squadService.findArmedForcesById(
                ctx.session.armedForcesId
            );
            await this.squadService.acceptMember(
                character,
                armedForces,
                message.text,
                ENUM_ARMED_FORCES_REQUEST.ACCEPTED
            );
            ctx.telegram.sendMessage(
                tgChatId,
                'Вашу заявку в боевые маги одобрили.'
            );
            await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
        }
    }
}
