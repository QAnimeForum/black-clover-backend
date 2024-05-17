import {
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
    Command,
} from 'nestjs-telegraf';
import { ADMIN_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import {  Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { UserService } from 'src/modules/user/services/user.service';
import { message } from 'telegraf/filters';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';
import { InvalidAnswerFilter } from '../../filters/invalid-answer.filter';
@Scene(SceneIds.ADMIN)
@UseFilters(TelegrafExceptionFilter)
export class AdminScene {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly characterService: CharacterService,
        private readonly userService: UserService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Админская панель';
        ctx.sendPhoto(
            {
                source: ADMIN_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [
                        BUTTON_ACTIONS.admin.PERMITIONS,
                        BUTTON_ACTIONS.admin.GRIMOIRE_REQUESTS,
                    ],
                    [
                        BUTTON_ACTIONS.admin.ANNOUNCEMENTS,
                        BUTTON_ACTIONS.admin.EVENTS,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.admin.PERMITIONS)
    async permitions(@Ctx() ctx: BotContext) {
        const superAdmins = await this.userService.getAdmins();
        const admins = await this.userService.getAdmins();
        let caption = 'Список суперадминов:\n\n';
        superAdmins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        caption += '\nСписок админов:\n\n';
        admins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        await ctx.reply(caption, {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Назначить админа',
                        `ACTION_ADD_ADMIN`
                    ),
                    Markup.button.callback(
                        'Снять админа',
                        `ACTION_DELETE_ADMIN`
                    ),
                ],
            ]),
        });
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        if ('data' in ctx.callbackQuery) {
            const action = ctx.callbackQuery.data;
            switch (action) {
                case 'ACTION_ADD_ADMIN': {
                    await ctx.scene.enter(SceneIds.ADD_ADMIN);
                    break;
                }
                case 'ACTION_DELETE_ADMIN': {
                    await ctx.scene.enter(SceneIds.DELETE_ADMIN);
                    break;
                }
            }
        }
    }
    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
    @Hears(BUTTON_ACTIONS.grimoire)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoire);
    }
}

@Wizard(SceneIds.ADD_ADMIN)
@UseFilters(TelegrafExceptionFilter)
export class AddAdminWizard {
    constructor(private readonly userService: UserService) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи TRADE ID игрока, которого хотите назначить админом.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.ADMIN);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {    
        const isUserExists = await this.userService.exists(message.text);
        console.log(isUserExists);
        if (!isUserExists) {
            ctx.reply(
                'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
            );
            ctx.wizard.back();
        } else {
           // this.userService.changeUserRole(message.text, ENUM_ROLE_TYPE.ADMIN);
            await ctx.scene.enter(SceneIds.ADMIN);
        }
    }
}

@Wizard(SceneIds.DELETE_ADMIN)
@UseFilters(TelegrafExceptionFilter)
export class DeleteAdminWizard {
    constructor(private readonly userService: UserService) {}

    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `🧟 Введи TRADE ID игрока, которого хотите снять с поста админа.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`
        );
    }

    @Command('cancel')
    @WizardStep(1)
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.ADMIN);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {
        console.log(message);
        const isUserExists = await this.userService.exists(message.text);
        if (!isUserExists) {
            ctx.reply(
                'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
            );
            ctx.wizard.back();
        }
       // this.userService.changeUserRole(message.text, ENUM_ROLE_TYPE.USER);
        await ctx.scene.enter(SceneIds.ADMIN);
    }
}
