import { Ctx, Hears, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ARMED_FORCES, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestDto } from 'src/modules/squards/dto/armed.forces.request.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { SQUAD_DEFAULT_PER_PAGE } from 'src/modules/squards/constants/squad.list.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    BACK_BUTTON,
    COMMANDER_IN_CHIEF_BUTTON,
    CREATE_SQUAD_BUTTON,
    JOIN_TO_ARMED_FORCES_BUTTON,
    MY_SQUAD_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
    SQUAD_LIST_BUTTON,
    TREASURY_BUTTON,
} from '../../constants/button-names.constant';
@Scene(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ArmedForcesScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly squadsService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        const state = await this.characterService.getStateByTgId(sender.id);
        const armedForces =
            await this.squadsService.findArmedForcesByState(state);
        ctx.session.armedForcesId = armedForces.id;
        const [ranks] = await this.squadsService.findRanksByArmedForces(
            armedForces.id
        );
        /*  const isUserSquadMember =
            await this.squadsService.isUserSquadMember(character);*/

        const isUserArmedForcesMember =
            await this.squadsService.isUserArmedForcesMember(character);
        const nameBlock = `<strong><u>${armedForces.name}</u></strong>`;
        const descripitonBlock = `<strong>Описание</strong>\n${armedForces.descripiton}`;
        let ranksBlock = `Ранговая система\n`;
        ranks.map((rank) => (ranksBlock += `<strong>${rank.name}</strong>\n`));
        const caption = `${nameBlock}\n\n${descripitonBlock}\n${ranksBlock}`;
        const buttons = [];
        if (!isUserArmedForcesMember) {
            buttons.push([JOIN_TO_ARMED_FORCES_BUTTON]);
        }
        /*if (isUserArmedForcesMember) {
            buttons.push([MY_SQUAD_BUTTON]);
        } else {
            buttons.push([JOIN_TO_ARMED_FORCES_BUTTON]);
        }*/
        buttons.push(
            [MY_SQUAD_BUTTON],
            [SQUAD_LIST_BUTTON],
            [COMMANDER_IN_CHIEF_BUTTON],
            [BACK_BUTTON]
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

    @Hears(JOIN_TO_ARMED_FORCES_BUTTON)
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
            armedForcesId: ctx.session.armedForcesId,
            characterId: character.id,
            tgUserId: tgUserId,
            tgUsername: tgUsername,
        };
        this.squadsService.createArmedForcesRequest(dto);
        ctx.reply(
            'Вы отправили заявку на вступление в вооружённые силы вышей страны! Через время с вами свяжутся.'
        );
    }

    @Hears(CREATE_SQUAD_BUTTON)
    async createSquad(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SQUAD_SCENE_ID);
    }

    @Hears(SQUAD_LIST_BUTTON)
    async squadList(@Ctx() ctx: BotContext) {
        this.showSquadsList(ctx);
    }

    @Hears(SHOW_SQUAD_REQUESTS_BUTTON)
    async squadRequests(@Ctx() ctx: BotContext) {
        this.showArmedForcesRequest(ctx);
    }

    @Hears(MY_SQUAD_BUTTON)
    async mySquad(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.SQUAD_SCENE_ID);
    }
    @Hears(COMMANDER_IN_CHIEF_BUTTON)
    async comander(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.COMMANDER_IN_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
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
                    await ctx.scene.enter(
                        ENUM_SCENES_ID.ARMY_REQUEST_ACCEPT_SCENE_ID
                    );
                    break;
                }
                case 'REJECT_REQUEST': {
                    await ctx.scene.enter(
                        ENUM_SCENES_ID.ARMY_REQUEST_REJECT_SCENE_ID
                    );
                    break;
                }
            }
        }
    }

    async showArmedForcesRequest(ctx: BotContext) {
        const armedForcesId = ctx.session.armedForcesId;
        const query: PaginateQuery = {
            limit: 10,
            path: '',
            filter: {
                forces_id: `$eq:${armedForcesId}`,
            },
        };
        const requests = await this.squadsService.findAllRequests(query);
        let caption = '<strong><u>Заявки</u></strong>\n\n';
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
                            BACK_BUTTON,
                            `BACK_TO_SQUADS_LIST`
                        ),
                    ],
                ]),
            }
        );
    }
    async showSquadsList(ctx: BotContext) {
        const armedForcesId = ctx.session.armedForcesId;
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
