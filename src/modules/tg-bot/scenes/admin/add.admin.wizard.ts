import { Inject, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    Wizard,
    SceneEnter,
    Ctx,
    Command,
    On,
    WizardStep,
    Message,
} from 'nestjs-telegraf';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import { ENUM_USER_PERMISSION_TYPE } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { Markup } from 'telegraf';
import { Logger } from 'winston';

@Wizard(ENUM_SCENES_ID.ADD_ADMIN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AddAdminWizard {
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи  ID игрока, которого хотите назначить админом.\n Если игрока не находит, то ему нужно прописать /start в боте!`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
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
            await this.userService.changeUserRole(
                message.text,
                ENUM_USER_PERMISSION_TYPE.ADMIN
            );
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь {id: ${message.text}} успешно добавлен в админы.`
            );
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        }
    }
}
