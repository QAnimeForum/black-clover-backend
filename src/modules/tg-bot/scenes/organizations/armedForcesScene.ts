import {
    Ctx,
    Hears,
    On,
    Scene,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
    Message,
    Command,
} from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { ARMED_FORCES, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestDto } from 'src/modules/squards/dto/armed.forces.request.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ARMED_FORCES_REQUEST } from 'src/modules/squards/constants/armed.forces.request.list';
import { SQUAD_DEFAULT_PER_PAGE } from 'src/modules/squards/constants/squad.list.constant';
@Scene(SceneIds.armedForces)
@UseFilters(TelegrafExceptionFilter)
export class ArmedForcesScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly squadsService: SquadsService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        const state = await this.characterService.getStateByTgId(sender.id);
        const armedForces =
            await this.squadsService.findArmedForcesByState(state);
        ctx.session.armed_forces_id = armedForces.id;
        const [ranks] =
            await this.squadsService.findRanksByArmedForces(armedForces);
        const isUserSquadMember =
            await this.squadsService.isUserSquadMember(character);

        const nameBlock = `<strong><u>${armedForces.name}</u></strong>`;
        const descripitonBlock = `<strong>Описание</strong>\n${armedForces.descripiton}`;
        let ranksBlock = `Ранговая система\n`;
        ranks.map((rank) => (ranksBlock += `<strong>${rank.name}</strong>\n`));
        const caption = `${nameBlock}\n\n${descripitonBlock}\n${ranksBlock}`;
        const buttons = [];
        if (isUserSquadMember) {
            buttons.push([BUTTON_ACTIONS.MY_SQUAD]);
        } else {
            buttons.push([BUTTON_ACTIONS.JOIN_TO_ARMED_FORCES]);
        }
        buttons.push(
            [BUTTON_ACTIONS.SHOW_SQUAD_REQUESTS, BUTTON_ACTIONS.SQUAD_LIST],
            [BUTTON_ACTIONS.back]
        );
        ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.JOIN_TO_ARMED_FORCES)
    async joinToArmedForces(@Ctx() ctx: BotContext, @Sender() sender) {
        const tgUserId: string = sender.id;
        const tgUsername: string = sender.username;
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        const isUserSquadMember =
            await this.squadsService.isUserSquadMember(character);
        if (isUserSquadMember) {
            ctx.reply('Вы уже являетесь членом какого-либо отряда.');
            return;
        }
        const isUserHasRequest =
            await this.squadsService.isUserSquadMemberRequest(character);
        if (isUserHasRequest) {
            ctx.reply('Вы уже отправили заявку, ждите результата.');
            return;
        }
        const dto: ArmedForcesRequestDto = {
            armedForcesId: ctx.session.armed_forces_id,
            characterId: character.id,
            tgUserId: tgUserId,
            tgUsername: tgUsername,
        };
        this.squadsService.createArmedForcesRequest(dto);
        ctx.reply(
            'Вы отправили заявку на вступление в вооружённые силы вышей страны! Через время с вами свяжутся.'
        );
    }

    @Hears(BUTTON_ACTIONS.CREATE_SQUAD)
    async createSquad(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.createSquad);
    }

    @Hears(BUTTON_ACTIONS.SQUAD_LIST)
    async squadList(@Ctx() ctx: BotContext) {
        this.showSquadsList(ctx);
    }

    @Hears(BUTTON_ACTIONS.SHOW_SQUAD_REQUESTS)
    async squadRequests(@Ctx() ctx: BotContext) {
        this.showArmedForcesRequest(ctx);
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');
            switch (action) {
                case 'GET_SQUADS': {
                    this.showSquadInformation(ctx, value);
                    break;
                }
                case 'BACK_TO_SQUADS_LIST': {
                    this.showSquadsList(ctx);
                    break;
                }
                case 'APPROVAL_REQUEST': {
                    await ctx.scene.enter(SceneIds.ARMY_REQUEST_ACCEPT);
                    break;
                }
                case 'REJECT_REQUEST': {
                    await ctx.scene.enter(SceneIds.ARMY_REQUEST_REJECT);
                    break;
                }
            }
        }
    }

    async showArmedForcesRequest(ctx: BotContext) {
        const armedForcesId = ctx.session.armed_forces_id;
        const query: PaginateQuery = {
            limit: 10,
            path: '',
            filter: {
                forces_id: `$eq:${armedForcesId}`,
            },
        };
        const requests = await this.squadsService.findAllRequests(query);
        console.log(requests);
        let caption =
            '<strong><u>Заявки</u></strong>\n\nНик | имя пероснажа | Магический атрибут | id\n';
        requests.data.map(
            (request: ArmedForcesRequestEntity, index: number) => {
                const requestBlock = `${index + 1})@${request.tgUsername} | ${request.character.background.name} | ${request.character.grimoire.magicName} | <code>${request.tgUserId}</code>\n`;
                caption += requestBlock;
            }
        );
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Одобрить заявку по id',
                        `APPROVAL_REQUEST`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Отклонить заявку по id',
                        `REJECT_REQUEST`
                    ),
                ],
            ]),
        });
    }

    async showSquadInformation(ctx: BotContext, squadId: string) {
        const squad = await this.squadsService.findSquadById(squadId);
        const membersCount = await this.squadsService.membersCount(squad.id);
        const title = `<strong>Отряд ${squad.name}</strong>\n\n`;
        const description = `<strong>Описание</strong>\n ${squad.description}\n`;
        const membersCountBlock = `<strong>Количество людей в отряде</strong>: ${membersCount}\n`;
        const caption = title + membersCountBlock + description;
        await ctx.replyWithPhoto(
            {
                source: `${STATIC_IMAGE_BASE_PATH}/${squad.image}`,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.back,
                            `BACK_TO_SQUADS_LIST`
                        ),
                    ],
                ]),
            }
        );
    }
    async showSquadsList(ctx: BotContext) {
        const armedForcesId = ctx.session.armed_forces_id;
        const query: PaginateQuery = {
            limit: SQUAD_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                forces_id: `$eq:${armedForcesId}`,
            },
        };
        const paginatedSquads = await this.squadsService.findAllSquads(query);
        const data = paginatedSquads.data;
        const { currentPage, totalPages } = paginatedSquads.meta;
        /**
         * const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
         */
        const inlineButtons = [];
        if (data.length == 1) {
            inlineButtons.push([
                Markup.button.callback(
                    data[0].name,
                    `GET_SQUADS:${data[0].id}`
                ),
            ]);
        }
        for (let i = 0; i < data.length - 1; i += 2) {
            inlineButtons.push([
                Markup.button.callback(
                    data[i].name,
                    `GET_SQUADS:${data[i].id}`
                ),
                Markup.button.callback(
                    data[i + 1].name,
                    `GET_SQUADS:${data[i + 1].id}`
                ),
            ]);
        }
        inlineButtons.push([
            Markup.button.callback(`${currentPage} из ${totalPages}`, `stop`),
            Markup.button.callback('>>', `next`),
        ]);
        ctx.reply('Отряды вашего королевства', {
            ...Markup.inlineKeyboard(inlineButtons),
        });
    }
}

@Wizard(SceneIds.ARMY_REQUEST_REJECT)
@UseFilters(TelegrafExceptionFilter)
export class RejectrequestWizard {
    constructor(
        private readonly userService: UserService,
        private readonly squadService: SquadsService
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
        await ctx.scene.enter(SceneIds.armedForces);
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
            const tgChatId: string = message.text;
            await this.squadService.changeRequestStatus(
                message.text,
                ENUM_ARMED_FORCES_REQUEST.REJECTED
            );
            ctx.telegram.sendMessage(
                tgChatId,
                'Вашу заявку в боевые маги не одобрили.'
            );
            await ctx.scene.enter(SceneIds.armedForces);
        }
    }
}

@Wizard(SceneIds.ARMY_REQUEST_ACCEPT)
@UseFilters(TelegrafExceptionFilter)
export class AcceptRequestWizard {
    constructor(
        private readonly userService: UserService,
        private readonly squadService: SquadsService
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
        await ctx.scene.enter(SceneIds.armedForces);
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
            const tgChatId: string = message.text;
            await this.squadService.changeRequestStatus(
                message.text,
                ENUM_ARMED_FORCES_REQUEST.REJECTED
            );
            ctx.telegram.sendMessage(
                tgChatId,
                'Вашу заявку в боевые маги одобрили.'
            );
            await ctx.scene.enter(SceneIds.armedForces);
        }
    }
}
