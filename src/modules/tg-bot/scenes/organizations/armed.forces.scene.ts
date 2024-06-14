import {
    Action,
    Ctx,
    Hears,
    On,
    Scene,
    SceneEnter,
    Sender,
} from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ARMED_FORCES, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestDto } from 'src/modules/squards/dto/armed.forces.request.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { SQUAD_DEFAULT_PER_PAGE } from 'src/modules/squards/constants/squad.list.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    ARMED_FORCES_BUTTON,
    ARMED_FORCES_CONTROL_BUTTON,
    BACK_BUTTON,
    COMMANDER_IN_CHIEF_BUTTON,
    CREATE_SQUAD_BUTTON,
    GET_A_WAGE_BUTTON,
    JOIN_TO_ARMED_FORCES_BUTTON,
    MY_SQUAD_BUTTON,
    SQUAD_LIST_BUTTON,
    TREASURY_BUTTON,
} from '../../constants/button-names.constant';
import { UserService } from 'src/modules/user/services/user.service';
@Scene(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ArmedForcesScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly userService: UserService,
        private readonly squadsService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') userTgId) {
        const state = await this.characterService.getStateByTgId(userTgId);
        const armedForces =
            await this.squadsService.findArmedForcesByState(state);
        ctx.session.armedForcesId = armedForces.id;
        await this.showArmedForces(ctx, userTgId);
    }

    @Hears(ARMED_FORCES_BUTTON)
    async armedForces(@Ctx() ctx: BotContext, @Sender('id') userTgId) {
        await this.showArmedForces(ctx, userTgId);
    }

    async generateMainArmedForcesKeyboard(userTgId: string) {
        const isUserSuperAdmin = this.userService.isSuperAdmin(userTgId);
        const character =
            await this.characterService.getCharacterIdByTgId(userTgId);
        const isUserArmedForcesMember =
            await this.squadsService.isUserArmedForcesMember(character);
        const isUserHasRequest =
            await this.squadsService.isUserHasRequest(userTgId);
        const buttons = [];
        if (!isUserArmedForcesMember && !isUserHasRequest) {
            buttons.push([JOIN_TO_ARMED_FORCES_BUTTON]);
        }
        buttons.push([SQUAD_LIST_BUTTON]);
        buttons.push([ARMED_FORCES_BUTTON, BACK_BUTTON]);

        return buttons;
    }
    async showArmedForces(ctx: BotContext, userTgId) {
        const buttons = await this.generateMainArmedForcesKeyboard(userTgId);
        let caption =
            '🛡️Добро пожаловать в Палату Рыцарей-Чародеев Королевства Клевер!🛡️\n\nЗдесь ты найдешь информацию о рыцарях-чародеях, системе рангов, своих будущих обязанностях,  о системе обучения, о боевых  отрядах  и о всех важных вещах, необходимых для твоего прохождения  службы. Готовься к геройству!\n';
        const linkRanks = `Система рангов рыцарей-чародеев: <a href='https://telegra.ph/Grimuar-i-zaklinaniya-02-03'>перейти</a>\n`;
        const linkJobTitles = `Какие должности возможны (и зарплата): <a href='https://telegra.ph/Grimuar-i-zaklinaniya-02-03'>перейти</a>\n\n`;
        const isUserHasRequest =
            await this.squadsService.isUserHasRequest(userTgId);
        caption += linkRanks;
        caption += linkJobTitles;
        if (isUserHasRequest) {
            caption +=
                '<strong><u>ВНИМАНИЕ:</u></strong> Вы отправили заявку в рыцари-чародеи. Ваша заявка на рассмотрении. \n';
        }

        /**

 */
        /*  if(isUserSuperAdmin) {
            buttons.push([COMMANDER_IN_CHIEF_BUTTON, BACK_BUTTON]);
        }*/
        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
        /*
        const ranks = await this.squadsService.findRanksByArmedForces(
            armedForces.id
        );
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
        buttons.push(
            [MY_SQUAD_BUTTON, TREASURY_BUTTON],
            [SQUAD_LIST_BUTTON],
            [COMMANDER_IN_CHIEF_BUTTON, BACK_BUTTON]
        )
        ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );*/
    }
    @Hears(JOIN_TO_ARMED_FORCES_BUTTON)
    async joinToArmedForces(@Ctx() ctx: BotContext, @Sender() sender) {
        const tgUserId = sender.id;
        const tgUsername: string = sender.username;
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        const isUserSquadMember =
            await this.squadsService.isUserSquadMember(character);
        if (isUserSquadMember) {
            await ctx.reply('Вы уже являетесь членом какого-либо отряда.');
            return;
        }
        const isUserHasRequest =
            await this.squadsService.isUserSquadMemberRequest(character);
        if (isUserHasRequest) {
            await ctx.reply(
                'От вас уже есть заявка на рассмотрение, ждите ответа.'
            );
            return;
        }
        const dto: ArmedForcesRequestDto = {
            armedForcesId: ctx.session.armedForcesId,
            characterId: character.id,
            tgUserId: tgUserId,
            tgUsername: tgUsername,
        };
        this.squadsService.createArmedForcesRequest(dto);
        const buttons = await this.generateMainArmedForcesKeyboard(tgUserId);
        await ctx.reply(
            'Вы отправили заявку на вступление в вооружённые силы вышей страны! Через время с вами свяжутся.',
            {
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons),
            }
        );
    }

    @Hears(TREASURY_BUTTON)
    async treasury(@Ctx() ctx: BotContext) {
        const caption =
            'Это сокровищница 💰 вашего королевства, здесь раз в сутки можно получать деньги. \nВаша выплата: 100 рублей.\n';

        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            GET_A_WAGE_BUTTON,
                            GET_A_WAGE_BUTTON
                        ),
                    ],
                ]),
            }
        );
    }
    @Hears(CREATE_SQUAD_BUTTON)
    async createSquad(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SQUAD_SCENE_ID);
    }

    @Hears(SQUAD_LIST_BUTTON)
    async squadList(@Ctx() ctx: BotContext) {
        await this.showSquadsList(ctx, 1);
    }

    @Action(GET_A_WAGE_BUTTON)
    async getAWageButton(@Ctx() ctx: BotContext) {
        const caption = `Вам начислено:`;
        await ctx.reply(caption);
    }

    @Action(/^(GET_SQUADS.*)$/)
    async getSquads(@Ctx() ctx: BotContext) {
        const [action, value] = ctx.callbackQuery['data'].split(':');
        this.showSquadInformation(ctx, value);
    }

    @Action('BACK_TO_SQUADS_LIST')
    async backToSquadList(@Ctx() ctx: BotContext) {
        await this.showSquadsList(ctx, 1);
    }
    /**
   * 
   * @param ctx   @On('callback_query')
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
   */
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
    async showSquadsList(ctx: BotContext, page: number) {
        const armedForcesId = ctx.session.armedForcesId;
        const query: PaginateQuery = {
            limit: SQUAD_DEFAULT_PER_PAGE,
            path: '',
            filter: {
                forces_id: `$eq:${armedForcesId}`,
            },
            page: page,
        };
        const paginatedSquads = await this.squadsService.findAllSquads(query);
        const data = paginatedSquads.data;
        const { currentPage, totalPages } = paginatedSquads.meta;
        const inlineButtons = [];
        data.map((squad) => {
            inlineButtons.push([
                Markup.button.callback(`${squad.name}`, `SQUAD:${squad.name}`),
            ]);
        });
        if (totalPages == 0) {
            inlineButtons.push([Markup.button.callback(`1 из 1`, `PAGE`)]);
        } else if (page == 1 && totalPages == 1) {
            inlineButtons.push([
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    `PAGE`
                ),
            ]);
        } else if (page == 1 && totalPages > 1) {
            inlineButtons.push([
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    `PAGE`
                ),
                Markup.button.callback(`>>`, `NEXT_PAGE:${page + 1}`),
            ]);
        } else if (currentPage == totalPages) {
            inlineButtons.push([
                Markup.button.callback(`<<`, `PREVIOUS_PAGE:${page - 1}`),
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    `PAGE`
                ),
            ]);
        } else {
            inlineButtons.push([
                Markup.button.callback(`<<`, `PREVIOUS_PAGE:${page - 1}`),
                Markup.button.callback(
                    `${currentPage} из ${totalPages}`,
                    `PAGE`
                ),
                Markup.button.callback(`>>`, `NEXT_PAGE:${page + 1}`),
            ]);
        }
        await ctx.reply('Отряды вашего королевства', {
            ...Markup.inlineKeyboard(inlineButtons),
        });
    }
}
