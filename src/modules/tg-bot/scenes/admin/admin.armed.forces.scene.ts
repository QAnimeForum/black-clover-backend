import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ARMED_FORCES_INFORMATION_BUTTON,
    ARMED_FORCES_RANKS_BUTTON,
    BACK_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
} from '../../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ArmedForcesRankEntity } from 'src/modules/squards/entity/armed.forces.rank.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_ARMED_FORCES_REQUEST } from 'src/modules/squards/constants/armed.forces.request.list';

@Scene(ENUM_SCENES_ID.ADMIN_ARMED_FORCES_MAGIC_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminArmedForcesScene {
    constructor(
        private readonly squadsService: SquadsService,
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const caption = 'Управление людьми';
        ctx.session.adminSelectedMemberId = null;
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.keyboard([
                [ARMED_FORCES_INFORMATION_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(ARMED_FORCES_INFORMATION_BUTTON)
    async showArmedForcesInformation(@Ctx() ctx: BotContext) {
        const armedForces = await this.squadsService.findAllArmedForces({
            path: '',
        });
        ctx.session.adminSelectedArmedForcesId = null;
        const inlineKeyboard = [];
        armedForces.data.map((item) =>
            inlineKeyboard.push([
                Markup.button.callback(
                    `${item.name}`,
                    `ARMED_FORCES:${item.id}`
                ),
            ])
        );
        const caption = 'Управление кварталом';
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(inlineKeyboard),
        });
    }

    @Action(/^ARMED_FORCES:(.*)$/)
    async showMenu(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const selectedId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminSelectedArmedForcesId = selectedId;
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const armedForces =
            await this.squadsService.findArmedForcesById(selectedId);
        const caption = `Админка армии ${armedForces.name}\n<strong>Страна: </strong>${armedForces.state.name}\n${armedForces.description}`;
        const keyboardButtons = [];
        keyboardButtons.push([
            ARMED_FORCES_RANKS_BUTTON,
            SHOW_SQUAD_REQUESTS_BUTTON,
            PEOPLE_MANAGEMENT_BUTTON,
        ]);
        keyboardButtons.push([ARMED_FORCES_INFORMATION_BUTTON, BACK_BUTTON]);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.keyboard(keyboardButtons).resize(),
        });
    }
    @Hears(SHOW_SQUAD_REQUESTS_BUTTON)
    async squadRequests(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        await this.showArmedForcesRequest(ctx, 1, true);
    }
    async showArmedForcesRequest(
        ctx: BotContext,
        page: number,
        isNewMessage: boolean
    ) {
        const armedForcesId = ctx.session.adminSelectedArmedForcesId;
        const query: PaginateQuery = {
            limit: 5,
            path: '',
            filter: {
                forces_id: `$eq:${armedForcesId}`,
                status: ENUM_ARMED_FORCES_REQUEST.PENDING,
            },
            page: page,
        };
        const armedForces =
            await this.squadsService.findArmedForcesById(armedForcesId);
        const requests = await this.squadsService.findAllRequests(query);
        const [caption, buttons] = showArmedForcesRequests(
            armedForces.name,
            requests
        );
        if (isNewMessage) {
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            });
        } else {
            await ctx.editMessageText(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            });
        }
    }

    @Hears(ARMED_FORCES_RANKS_BUTTON)
    async showRanks(@Ctx() ctx: BotContext, @Sender() sender) {
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        if (!isAdmin) {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        const armedForcesId = ctx.session.adminSelectedArmedForcesId;
        /**
 *         const ranks = await this.squadsService.findAllRanks({
            path: '',
            filter: {
                armedForcesId: `$eq:${armedForcesId}`,
            },
        });
 */

        const armedForces =
            await this.squadsService.findArmedForcesById(armedForcesId);
        const rank =
            await this.squadsService.findRanksByArmedForces(armedForcesId);
        let caption = `<strong>Ранги (${armedForces.state.name})</strong>\n`;
        caption += this.showRankInfo(rank);
        caption += this.showRanksInfo(rank.children);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
        });
    }

    @Action(/^(ACCEPT_REQUEST.*)$/)
    async acceptRequest(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const requestId = ctx.callbackQuery['data'].split(':')[1];
        const member = await this.squadsService.acceptRequest(requestId);
        if (member) {
            const character = await this.characterService.findCharacterById(
                member.characterId
            );
            const request = await this.squadsService.findRequestById(requestId);
            await ctx.telegram.sendMessage(
                character.user.tgUserId,
                `Вашу заявку в ${request.armedForces.name} одобрили.`
            );
        } else {
            const request = await this.squadsService.findRequestById(requestId);
            const character = await this.characterService.findCharacterById(
                request.characterId
            );
            await ctx.telegram.sendMessage(
                character.user.tgUserId,
                `Вашу заявку в ${request.armedForces.name} отклонили`
            );
        }
        await this.showArmedForcesRequest(ctx, 1, true);
    }

    @Action(/^(REJECT_REQUEST.*)$/)
    async rejectRequest(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const request = ctx.callbackQuery['data'].split(':')[1];
        await this.squadsService.rejectRequest(request);
        await this.showArmedForcesRequest(ctx, 1, true);
    }
    showRanksInfo(children: Array<ArmedForcesRankEntity>) {
        let caption = '';
        children.map((item) => {
            caption += this.showRankInfo(item);
            caption += this.showRanksInfo(item.children);
        });
        return caption;
    }
    showRankInfo(rank: ArmedForcesRankEntity) {
        let caption = '';
        caption += `<strong>${rank.name}</strong>\n`;
        caption += 'Зарплата: ';
        caption += `${rank.salary.copper} 🟤`;
        caption += `${rank.salary.silver} ⚪️`;
        caption += `${rank.salary.eclevtrum} 🔵`;
        caption += `${rank.salary.gold} 🟡`;
        caption += `${rank.salary.platinum} 🪙\n`;
        caption += `Звёзды для получения: ${rank.star}\n\n`;
        return caption;
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.adminSelectedArmedForcesId = null;
        ctx.session.adminSelectedMemberId = null;
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }

    @Action(/^(CHARACTER_NEXT_PAGE.*)$/)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        await this.showArmedForcesRequest(ctx, page, false);
    }

    @Action(/^(CHARACTER_PREVIOUS_PAGE.*)$/)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        await this.showArmedForcesRequest(ctx, page, false);
    }

    @Hears(PEOPLE_MANAGEMENT_BUTTON)
    async peoplesHears(@Ctx() ctx: BotContext) {
        const [caption, keyboard] = await this.showPeopleList(ctx);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action(PEOPLE_MANAGEMENT_BUTTON)
    async peopleAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const [caption, keyboard] = await this.showPeopleList(ctx);
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }
    async showPeopleList(
        ctx: BotContext
    ): Promise<[string, InlineKeyboardButton[][]]> {
        const armedForces = await this.squadsService.findArmedForcesById(
            ctx.session.adminSelectedArmedForcesId
        );
        const members = await this.squadsService.findAllArmedForcesMembers({
            path: '',
            filter: {
                armedForcesId: `$eq:${armedForces.id}`,
            },
        });
        const title = '<strong><u>СПИСОК </u></strong>\n';
        let caption = title;
        const keyboard = [
            [
                Markup.button.callback('Сортировать по рангу', 'SORT_BY_RANK'),
                Markup.button.callback(
                    'Сортировать по должности',
                    'SORT_BY_JOB_TITLE'
                ),
            ],
            [
                Markup.button.callback('Сортировать по имени', 'SORT_BY_NAME'),
                Markup.button.callback(
                    'Сортировать по отряду',
                    'SORT_BY_SQUAD'
                ),
            ],
        ];
        members.data.map((member, index) => {
            const item = `${index + 1}) ${member.character.background.name}, ${member.character?.grimoire?.magicName ?? ''}, ${member.rank.name}`;
            caption += item;
            keyboard.push([
                Markup.button.callback(
                    member.character.background.name,
                    `MEMBER:${member.id}`
                ),
            ]);
        });
        return [caption, keyboard];
    }
    @Action(/^(MEMBER.*)$/)
    async member(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const selectedId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminSelectedMemberId = selectedId;
        const caption = await this.showCharacterInfo(
            ctx,
            ctx.session.adminSelectedMemberId
        );
        const buttons = [
            [
                Markup.button.callback(
                    'Изменить ранг',
                    `CHANGE_RANK:${selectedId}`
                ),
            ],
            [
                Markup.button.callback('+ ⭐️', `ADD_STAR:${selectedId}`),
                Markup.button.callback('- ⭐️', `REMOVE_STAR:${selectedId}`),
            ],
            [Markup.button.callback('Наградить из казны', 'REWARD')],
            [Markup.button.callback('Уволить', 'FIRE')],
            [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
        ];
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(CHANGE_RANK.*)$/)
    async changeRank(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const selectedId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminSelectedMemberId = selectedId;
        let ranks = await this.squadsService.findRanksByArmedForces(
            ctx.session.adminSelectedArmedForcesId
        );

        const caption = await this.showCharacterInfo(ctx, selectedId);
        const keyboard = [];
        keyboard.push([Markup.button.callback(ranks.name, `RANK:${ranks.id}`)]);
        while (ranks.children && ranks.children.length > 0) {
            ranks.children.map((rank) => {
                keyboard.push([
                    Markup.button.callback(rank.name, `RANK:${rank.id}`),
                ]);
            });
            ranks = ranks.children[0];
        }
        keyboard.push([
            Markup.button.callback(BACK_BUTTON, `MEMBER:${selectedId}`),
        ]);

        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action(/^(RANK.*)$/)
    async selectRank(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const rankId = await ctx.callbackQuery['data'].split(':')[1];
        const memberId = ctx.session.adminSelectedMemberId;
        const member = await this.squadsService.changeRank(rankId, memberId);
        const caption = await this.showCharacterInfo(ctx, memberId);
        const character = await this.characterService.findCharacterById(
            member.characterId
        );
        await ctx.telegram.sendMessage(
            character.user.tgUserId,
            `Ваш ранг изменён на ${member.rank.name}`
        );
        const buttons = [
            [
                Markup.button.callback(
                    'Изменить ранг',
                    `CHANGE_RANK:${memberId}`
                ),
            ],
            [
                Markup.button.callback('+ ⭐️', `ADD_STAR:${memberId}`),
                Markup.button.callback('- ⭐️', `REMOVE_STAR:${memberId}`),
            ],
            [Markup.button.callback('Наградить из казны', 'REWARD')],
            [Markup.button.callback('Уволить', 'FIRE')],
            [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
        ];
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    async showCharacterInfo(ctx: BotContext, selectedId: string) {
        const armedForcesInfo =
            await this.squadsService.findArmedForcesMember(selectedId);
        const character = await this.characterService.findCharacterById(
            armedForcesInfo.characterId
        );
        const tgId = await this.characterService.findTgIdByCharacterId(
            character.id
        );
        let caption = `Персонаж\n`;
        caption += `<strong>Имя: </strong>${character.background.name}\n`;
        caption += `<strong>Магический атрибут: </strong>${character?.grimoire?.magicName ?? ''}\n`;
        caption += `ID:<code>${tgId}</code>\n`;
        caption += `<strong>Звёзды</strong>: ${armedForcesInfo.stars}\n`;
        caption += `<strong>Ранг: </strong>${armedForcesInfo.rank.name}\n`;
        return caption;
    }

    @Action(/^(ADD_STAR.*)$/)
    async addStar(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const memberId = await ctx.callbackQuery['data'].split(':')[1];
        await this.squadsService.addStar(memberId);
        const caption = await this.showCharacterInfo(
            ctx,
            ctx.session.adminSelectedMemberId
        );
        const buttons = [
            [
                Markup.button.callback(
                    'Изменить ранг',
                    `CHANGE_RANK:${memberId}`
                ),
            ],
            [
                Markup.button.callback('+ ⭐️', `ADD_STAR:${memberId}`),
                Markup.button.callback('- ⭐️', `REMOVE_STAR:${memberId}`),
            ],
            [Markup.button.callback('Наградить из казны', 'REWARD')],
            [Markup.button.callback('Уволить', 'FIRE')],
            [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
        ];
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(REMOVE_STAR.*)$/)
    async removeStar(@Ctx() ctx: BotContext) {
        const memberId = await ctx.callbackQuery['data'].split(':')[1];
        const isRemoved = await this.squadsService.removeStar(memberId);
        if (isRemoved) {
            const caption = await this.showCharacterInfo(
                ctx,
                ctx.session.adminSelectedMemberId
            );
            const buttons = [
                [
                    Markup.button.callback(
                        'Изменить ранг',
                        `CHANGE_RANK:${memberId}`
                    ),
                ],
                [
                    Markup.button.callback('+ ⭐️', `ADD_STAR:${memberId}`),
                    Markup.button.callback('- ⭐️', `REMOVE_STAR:${memberId}`),
                ],
                [Markup.button.callback('Наградить из казны', 'REWARD')],
                [Markup.button.callback('Уволить', 'FIRE')],
                [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
            ];
            await ctx.editMessageText(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            });
        }
    }

    @Action(/^(FIRE.*)$/)
    async fire(@Ctx() ctx: BotContext) {
        const caption = 'Вы точно хотите уволить человека?';
        const buttons = [
            [Markup.button.callback('Да', 'YES_FIRE')],

            [Markup.button.callback('Нет', 'NO_FIRE')],
        ];

        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action('YES_FIRE')
    async yesFire(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const result = await this.squadsService.fire(
            ctx.session.adminSelectedMemberId
        );
        ctx.session.adminSelectedMemberId = null;
        const [caption, keyboard] = await this.showPeopleList(ctx);
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action('NO_FIRE')
    async noFire(@Ctx() ctx: BotContext) {
        const caption = await this.showCharacterInfo(
            ctx,
            ctx.session.adminSelectedMemberId
        );
        const buttons = [
            [
                Markup.button.callback(
                    'Изменить ранг',
                    `CHANGE_RANK:${ctx.session.adminSelectedMemberId}`
                ),
            ],
            [
                Markup.button.callback(
                    '+ ⭐️',
                    `ADD_STAR:${ctx.session.adminSelectedMemberId}`
                ),
                Markup.button.callback(
                    '- ⭐️',
                    `REMOVE_STAR:${ctx.session.adminSelectedMemberId}`
                ),
            ],
            [Markup.button.callback('Наградить из казны', 'REWARD')],
            [Markup.button.callback('Уволить', 'FIRE')],
            [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
        ];
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
}

export const showArmedForcesRequests = (
    armedForcesName: string,
    request: Paginated<ArmedForcesRequestEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = request;
    const { currentPage, totalPages, totalItems } = meta;

    let caption = `<strong>Заявки (${armedForcesName})</strong>`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((request, index) => {
        caption += `${index + 1})@${request.tgUsername} | ${request.character.background.name} | ${request.character?.grimoire?.magicName} <code>${request.tgUserId}</code>\n`;

        buttons.push([
            Markup.button.callback(
                `Заявка  № ${index + 1}`,
                `Заявка  № ${index + 1}`
            ),
            Markup.button.callback('+', `ACCEPT_REQUEST:${request.id}`),
            Markup.button.callback('-', `REJECT_REQUEST:${request.id}`),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${meta.currentPage} из ${meta.totalPages}`,
                `PAGE`
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};
