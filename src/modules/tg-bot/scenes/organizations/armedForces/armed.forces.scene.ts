import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';

import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestDto } from 'src/modules/squards/dto/armed.forces.request.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { SQUAD_DEFAULT_PER_PAGE } from 'src/modules/squards/constants/squad.list.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { UserService } from 'src/modules/user/services/user.service';
import {
    ARMED_FORCES_BUTTON,
    JOIN_TO_ARMED_FORCES_BUTTON,
    SQUAD_LIST_BUTTON,
    BACK_BUTTON,
    TREASURY_BUTTON,
    GET_A_WAGE_BUTTON,
    CREATE_SQUAD_BUTTON,
    MY_SQUAD_BUTTON,
    COMMANDER_IN_CHIEF_BUTTON,
    ARMED_FORCES_INFORMATION_BUTTON,
    ARMED_FORCES_RANKS_BUTTON,
    ARMED_FORCES_MAIN_BUTTON,
    EXIT_FROM_ARMY_FORCES_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import {
    ARMED_FORCES,
    STATIC_IMAGE_BASE_PATH,
} from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { ArmedForcesRankEntity } from 'src/modules/squards/entity/armed.forces.rank.entity';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { button } from 'telegraf/typings/markup';
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
        ctx.session.armedForcesId = null;
        const character =
            await this.characterService.getCharacterIdByTgId(userTgId);
        const isUserArmedForcesMember =
            await this.squadsService.isUserArmedForcesMember(character);
        const isSquadMember =
            await this.squadsService.isUserSquadMember(character);
        const buttons = [];
        if (isUserArmedForcesMember) {
            buttons.push([SQUAD_LIST_BUTTON]);
            buttons.push([ARMED_FORCES_MAIN_BUTTON]);
        }
        if (isSquadMember) {
            buttons.push([MY_SQUAD_BUTTON]);
        }
        buttons.push([ARMED_FORCES_INFORMATION_BUTTON, BACK_BUTTON]);
        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption: 'Добро пожаловать в военный квартал',
                parse_mode: 'HTML',
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }

    @Hears(ARMED_FORCES_INFORMATION_BUTTON)
    async armedList(@Ctx() ctx: BotContext) {
        const armedForces = await this.squadsService.findAllArmedForces({
            path: '',
        });
        const caption = 'Информацию о какой армии вы хотите узнать?';
        const buttons = [];
        armedForces.data.map((item) => {
            buttons.push([
                Markup.button.callback(
                    `${item.name} (${item.state.name})`,
                    `ARMED_FORCES:${item.id}`
                ),
            ]);
        });
        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(/^ARMED_FORCES:(.*)$/)
    async armedForcesAction(@Ctx() ctx: BotContext, @Sender('id') userTgId) {
        await ctx.answerCbQuery();
        const armedForcesId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.armedForcesId = armedForcesId;
        const character =
            await this.characterService.getCharacterIdByTgId(userTgId);
        await this.showArmedForcesWelcomeInformation(
            ctx,
            armedForcesId,
            character
        );
    }

    @Action(ARMED_FORCES_BUTTON)
    async main(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const armedForces = await this.squadsService.findAllArmedForces({
            path: '',
        });
        const caption = 'Информацию о какой армии вы хотите узнать?';
        const buttons = [];
        armedForces.data.map((item) => {
            buttons.push([
                Markup.button.callback(
                    `${item.name} (${item.state.name})`,
                    `ARMED_FORCES:${item.id}`
                ),
            ]);
        });
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    async showArmedForcesWelcomeInformation(
        ctx: BotContext,
        armedForcesId: string,
        character: CharacterEntity
    ) {
        const armedForces =
            await this.squadsService.findArmedForcesById(armedForcesId);
        let caption = `🛡️Добро пожаловать в Палату организации "${armedForces.name}" (${armedForces.state.fullName})!🛡️\n\n`;
        caption += `<strong>Описание</strong>\n${armedForces.description}\n\n`;
        caption += `Здесь ты найдешь информацию о рыцарях-чародеях, системе рангов, своих будущих обязанностях,  о системе обучения, о боевых  отрядах  и о всех важных вещах, необходимых для твоего прохождения  службы. Готовься к геройству!`;
        const isUserArmedForcesMember =
            await this.squadsService.isUserArmedForcesMember(character);
        const isUserHasAnyRequest =
            await this.squadsService.isUserHasAnyRequest(
                character.user.tgUserId
            );

        const buttons = [];
        buttons.push(
            [
                Markup.button.callback(
                    ARMED_FORCES_RANKS_BUTTON,
                    `ARMED_FORCES_RANK:${armedForcesId}`
                ),
            ],
            [
                Markup.button.callback(
                    SQUAD_LIST_BUTTON,
                    `SQUAD_LIST_BUTTON:${armedForcesId}`
                ),
            ]
        );
        if (!isUserArmedForcesMember && !isUserHasAnyRequest) {
            buttons.push([
                Markup.button.callback(
                    JOIN_TO_ARMED_FORCES_BUTTON,
                    JOIN_TO_ARMED_FORCES_BUTTON
                ),
            ]);
        }
        buttons.push([
            Markup.button.callback(BACK_BUTTON, ARMED_FORCES_BUTTON),
        ]);
        const isUserHasRequest = await this.squadsService.isUserHasRequest(
            character.user.tgUserId,
            armedForcesId
        );
        if (isUserHasRequest) {
            caption +=
                '\n\n <strong> Вы подали заявку. C вами свяжутся.</strong>';
        }
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(/^ARMED_FORCES_RANK:(.*)$/)
    async showRanks(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const armedForcesId = await ctx.callbackQuery['data'].split(':')[1];
        const rank =
            await this.squadsService.findRanksByArmedForces(armedForcesId);
        let caption = '<strong>Ранги</strong>\n';
        caption += this.showRankInfo(rank);
        caption += this.showRanksInfo(rank.children);
        await ctx.deleteMessage();
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        BACK_BUTTON,
                        `ARMED_FORCES:${armedForcesId}`
                    ),
                ],
            ]),
        });
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

    @Action(JOIN_TO_ARMED_FORCES_BUTTON)
    async joinToArmedForces(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const tgUserId = sender.id;
        const tgUsername: string = sender.username;
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        /**
         * if (character.grimoire == null) {
            await ctx.reply(
                'У вас нет гримуара! Вы не можете вступить в армию вашего королевства.'
            );
            return;
        }
         */

        const isUserSquadMember = false;
        // await this.squadsService.isUserSquadMember(character);
        if (isUserSquadMember) {
            await ctx.reply('Вы уже являетесь членом какого-либо отряда.');
            return;
        }
        const isUserHasRequest = await this.squadsService.isUserHasAnyRequest(
            character.user.tgUserId
        );
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
        //  const buttons = await this.generateMainArmedForcesKeyboard(tgUserId);
        await ctx.reply(
            'Вы отправили заявку на вступление в вооружённые силы вышей страны! Через время с вами свяжутся.'
        );
    }

    @Hears(ARMED_FORCES_MAIN_BUTTON)
    async mainOffice(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const buttons = [];
        const squadMember = await this.squadsService.findArmedForcesMemberByTgId(tgId);
        buttons.push([
            Markup.button.callback(TREASURY_BUTTON, TREASURY_BUTTON),
        ]);
        buttons.push([
            Markup.button.callback(
                EXIT_FROM_ARMY_FORCES_BUTTON,
                EXIT_FROM_ARMY_FORCES_BUTTON
            ),
        ]);
        let caption = `<strong>Информация о вас</strong>\n`;
        caption += `Ваш ранг: ${squadMember.rank.name}\n`;
        caption += `Количество звёзд: ${squadMember.stars}\n`;
        await ctx.sendPhoto(
            {
                source: ARMED_FORCES,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(EXIT_FROM_ARMY_FORCES_BUTTON)
    async exit(@Ctx() ctx: BotContext) {
        const caption = 'Вы точно хотите уволиться?';
        const buttons = [
            [Markup.button.callback('Да', 'YES_FIRE')],

            [Markup.button.callback('Нет', 'NO_FIRE')],
        ];

        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action('YES_FIRE')
    async yesFire(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        await ctx.answerCbQuery();
        const member =
            await this.squadsService.findArmedForcesMemberByTgId(tgId);
        const result = await this.squadsService.fire(member.id);
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Action('NO_FIRE')
    async noFire(@Ctx() ctx: BotContext) {
        await ctx.reply('Вы остались.');
    }
    @Action(TREASURY_BUTTON)
    async treasury(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const caption =
            'Это сокровищница 💰 вашего королевства, здесь раз в сутки можно получать деньги. \nВаша выплата.\n';

        await ctx.editMessageCaption(caption, {
            ...Markup.inlineKeyboard([
                [Markup.button.callback(GET_A_WAGE_BUTTON, GET_A_WAGE_BUTTON)],
            ]),
        });
    }
    @Hears(CREATE_SQUAD_BUTTON)
    async createSquad(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SQUAD_SCENE_ID);
    }

    @Action(/^SQUAD_LIST_BUTTON:(.*)$/)
    async squadList(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const armedForcesId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.armedForcesId = armedForcesId;
        await this.showSquadsList(ctx, armedForcesId, 1);
    }

    @Action(GET_A_WAGE_BUTTON)
    async getAWageButton(@Ctx() ctx: BotContext) {
        const caption = `Вам начислено:`;
        await ctx.reply(caption);
    }

    @Action(/^(SQUAD.*)$/)
    async getSquads(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const [action, value] = ctx.callbackQuery['data'].split(':');
        await this.showSquadInformation(ctx, value);
    }

    @Action('BACK_TO_ARMED_FORCES')
    async backToSquadList(@Ctx() ctx: BotContext) {
        //   await this.showSquadsList(ctx, 1);
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

    @Action('BACK_TO_SQUADS_LIST')
    async backToSquadsList(@Ctx() ctx: BotContext) {
        await this.showSquadsList(ctx, ctx.session.armedForcesId, 1);
    }
    async showSquadInformation(ctx: BotContext, squadId: string) {
        const squad = await this.squadsService.findSquadById(squadId);
        const membersCount = await this.squadsService.membersCount(squad.id);
        const title = `<strong>Отряд ${squad.name}</strong>\n\n`;
        const description = `<strong>Описание</strong>\n ${squad.description}\n`;
        const membersCountBlock = `<strong>Количество людей в отряде</strong>: ${membersCount}\n`;
        const caption = title + membersCountBlock + description;
        await ctx.deleteMessage();
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
    async showSquadsList(ctx: BotContext, armedForcesId: string, page: number) {
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
                Markup.button.callback(`${squad.name}`, `SQUAD:${squad.id}`),
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
        inlineButtons.push([
            Markup.button.callback(
                BACK_BUTTON,
                `ARMED_FORCES:${armedForcesId}`
            ),
        ]);
        await ctx.editMessageCaption('Отряды вашего королевства', {
            ...Markup.inlineKeyboard(inlineButtons),
        });
    }
}
