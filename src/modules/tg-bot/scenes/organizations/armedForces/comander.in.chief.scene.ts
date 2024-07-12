import { UseFilters, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginateQuery } from 'nestjs-paginate';
import {
    Scene,
    SceneEnter,
    Ctx,
    Hears,
    Sender,
    Action,
    On,
} from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import {
    TREASURY_BUTTON,
    CREATE_SQUAD_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    BACK_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TgBotService } from 'src/modules/tg-bot/services/tg-bot.service';
import { UserService } from 'src/modules/user/services/user.service';
import { Markup } from 'telegraf';
import { Logger } from 'typeorm';

@Scene(ENUM_SCENES_ID.COMMANDER_IN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CommanderInChiefScene {
    constructor(
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        private readonly tgBotService: TgBotService,
        private readonly squadsService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        await ctx.reply('меню', {
            ...Markup.keyboard([
                [TREASURY_BUTTON, CREATE_SQUAD_BUTTON],
                [SHOW_SQUAD_REQUESTS_BUTTON, PEOPLE_MANAGEMENT_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(PEOPLE_MANAGEMENT_BUTTON)
    async peoples(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const state = await this.characterService.getStateByTgId(tgId);
        const armedForces =
            await this.squadsService.findArmedForcesByState(state);

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
            const item = `${index + 1}) ${member.character.background.name}, ${member.character.grimoire.magicName}, ${member.rank.name}`;
            caption += item;
            keyboard.push([
                Markup.button.callback(
                    member.character.background.name,
                    `MEMBER:${member.character.id}`
                ),
            ]);
        });

        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action(PEOPLE_MANAGEMENT_BUTTON)
    async peoplesAction(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const state = await this.characterService.getStateByTgId(
            ctx.from.id.toString()
        );
        const armedForces =
            await this.squadsService.findArmedForcesByState(state);

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
            const item = `${index + 1}) ${member.character.background.name}, ${member.character.grimoire.magicName}, ${member.rank.name}`;
            caption += item;
            keyboard.push([
                Markup.button.callback(
                    member.character.background.name,
                    `MEMBER:${member.character.id}`
                ),
            ]);
        });

        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }
    @Hears(SHOW_SQUAD_REQUESTS_BUTTON)
    async squadRequests(@Ctx() ctx: BotContext) {
        this.showArmedForcesRequest(ctx);
    }
    async showArmedForcesRequest(ctx: BotContext) {
        const armedForcesId = ctx.session.armedForcesId;
        const query: PaginateQuery = {
            limit: 5,
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

    async showCharacterInfo(ctx: BotContext, selectedId: string) {
        const character =
            await this.characterService.findCharacterById(selectedId);
        const tgId = await this.characterService.findTgIdByCharacterId(
            character.id
        );
        const armedForcesInfo = await this.squadsService.findArmedForcesMember(
            character.id
        );
        const title = `Персонаж`;
        const name = `<strong>Имя: </strong>${character.background.name}`;
        const magicName = `<strong>Магический атрибут:</strong>${character.grimoire.magicName}`;
        const tgText = `ID:<code>${tgId}</code>`;
        const rankText = `<strong>Ранг: </strong>${armedForcesInfo.rank.name}`;
        const caption = `${title}\n\n${name}\n${magicName}\n${tgText}\n${rankText}`;
        return caption;
    }

    @Action(/^(CHANGE_RANK.*)$/)
    async changeRank(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const selectedId = await ctx.callbackQuery['data'].split(':')[1];
        const ranks = await this.squadsService.findRanksByArmedForces(
            ctx.session.armedForcesId
        );

        const caption = await this.showCharacterInfo(ctx, selectedId);
        const keyboard = [];
        ranks.map((rank) => {
            keyboard.push([
                Markup.button.callback(rank.name, `RANK:${rank.id}`),
            ]);
        });
        keyboard.push([
            Markup.button.callback(BACK_BUTTON, `MEMBER:${selectedId}`),
        ]);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action(/^(MEMBER.*)$/)
    async member(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();

        const selectedId = await ctx.callbackQuery['data'].split(':')[1];
        const caption = await this.showCharacterInfo(ctx, selectedId);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Изменить ранг',
                        `CHANGE_RANK:${selectedId}`
                    ),
                ],
                [Markup.button.callback('Наградить из казны', 'REWARD')],
                [Markup.button.callback(BACK_BUTTON, PEOPLE_MANAGEMENT_BUTTON)],
            ]),
        });
    }
    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        if ('data' in ctx.callbackQuery) {
            const [action, value] = await ctx.callbackQuery.data.split(':');

            switch (action) {
                case 'SORT_BY_RANK': {
                    await ctx.reply('Сортировать по рангу');
                    break;
                }

                case 'SORT_BY_JOB_TITLE': {
                    await ctx.reply('Сортировать по работе');
                    break;
                }

                case 'SORT_BY_NAME': {
                    await ctx.reply('Сортировать по имени');
                    break;
                }

                case 'SORT_BY_SQUAD': {
                    await ctx.reply('Сортировать по отряду');
                    break;
                }
                case 'REWARD': {
                    await ctx.reply('Наградить кого-то');
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
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ARMED_FORCES_SCENE_ID);
    }
}

@Scene(ENUM_SCENES_ID.CHANGE_RANK_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ChangeRankScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly tgBotService: TgBotService,
        private readonly squadsService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const ranks = await this.squadsService.findRanksByArmedForces(
            ctx.session.armedForcesId
        );
        await ctx.reply('меню', {
            ...Markup.keyboard([[BACK_BUTTON]]).resize(),
        });
    }
}
