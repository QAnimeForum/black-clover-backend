import { Ctx, Hears, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { TgBotService } from '../services/tg-bot.service';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { SceneIds } from '../constants/scenes.id';
import { UseFilters, UseGuards } from '@nestjs/common';

import {
    HELLO_IMAGE_PATH,
    SPIRITS_IMAGE_PATH,
    STATIC_IMAGE_BASE_PATH,
} from '../constants/images';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../constants/actions';
import { SpiritService } from '../../spirits/service/spirit.service';
import { UserService } from 'src/modules/user/services/user.service';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { RolesGuard } from '../common/guards/allowed-roles.guard';
import { AllowedRoles } from '../common/decorators/allowed-roles.decorator';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';

@Scene(SceneIds.home)
@UseFilters(TelegrafExceptionFilter)
@UseGuards(RolesGuard)
@AllowedRoles(ENUM_ROLE_TYPE.SUPER_ADMIN)
export class HomeScene {
    constructor(
        private readonly userSerivce: UserService,
        private readonly grimoireService: GrimoireService,
        private readonly spiritsService: SpiritService
    ) {}

    @SceneEnter()
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const userTgId = sender.id;
        const isShowAdminButton =
            await this.userSerivce.isShowAdminButton(userTgId);
        const caption = 'Привет, путник!';
        ctx.reply(
            `Поздравляем! Вы заполнили базовую информацию о персонаже. \n Для того, чтобы принимать активное участие в мире клевера, вам необходимо иметь гримуар. Перейдите во вкладку`
        );
        const buttons = [
            [
                BUTTON_ACTIONS.profile,
                BUTTON_ACTIONS.ORGANIZATIONS,
                BUTTON_ACTIONS.map,
            ],
            [BUTTON_ACTIONS.allDevils, BUTTON_ACTIONS.allSpirits],
            [BUTTON_ACTIONS.quests, BUTTON_ACTIONS.help],
        ];
        if (isShowAdminButton) {
            buttons.push([BUTTON_ACTIONS.ADMIN_PANEL]);
        }
        console.log(buttons);
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.ORGANIZATIONS)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async armedForces(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }

    @Hears(BUTTON_ACTIONS.ADMIN_PANEL)
    @AllowedRoles(ENUM_ROLE_TYPE.ADMIN)
    async admin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.ADMIN);
    }
    @Hears(BUTTON_ACTIONS.profile)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
    @Hears(BUTTON_ACTIONS.map)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async map(@Ctx() ctx: BotContext) {
        ctx.reply('Карта пока выключена');
        //  await ctx.scene.enter(SceneIds.map);
    }

    @Hears(BUTTON_ACTIONS.allDevils)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async devils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allDevils);
    }

    @Hears(BUTTON_ACTIONS.allSpirits)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async spirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.allSpirits);
    }

    @Hears(BUTTON_ACTIONS.quests)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async quests(@Ctx() ctx: BotContext) {
        ctx.reply('У вас нет квестов');
    }
    @Hears(BUTTON_ACTIONS.help)
    @AllowedRoles(ENUM_ROLE_TYPE.USER, ENUM_ROLE_TYPE.ADMIN)
    async help(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.help);
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');
            switch (action) {
                case 'GET_SPIRIT_INFO': {
                    const spirit =
                        await this.spiritsService.findSpiritById(value);
                    const title = `<strong><u>Дух ${spirit.name}</u></strong>\n\n`;
                    const description = `<strong>Описание</strong> ${spirit.description}`;
                    const caption = title + description;
                    await ctx.replyWithPhoto(
                        {
                            source: `${STATIC_IMAGE_BASE_PATH}/${spirit.image}`,
                        },
                        {
                            caption: caption,
                            parse_mode: 'HTML',
                        }
                    );
                }
            }
        }
    }
}
