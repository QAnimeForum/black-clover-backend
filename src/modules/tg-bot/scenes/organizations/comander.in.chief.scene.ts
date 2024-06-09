import { Ctx, Hears, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { MINES_PATH, STATIC_IMAGE_BASE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { MineService } from '../../../mines/services/mine.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MINE_DEFAULT_PER_PAGE } from 'src/modules/mines/constants/mine.list.constant';
import {
    BACK_BUTTON,
    CREATE_SQUAD_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
    TREASURY_BUTTON,
} from '../../constants/button-names.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';

@Scene(ENUM_SCENES_ID.COMMANDER_IN_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CommanderInChiefScene {
    constructor(
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
    async peoples(@Ctx() ctx: BotContext, @Sender('id') tgId: number) {
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
        members.data.map((member, index) => {
            console.log(member);
            const item = `${index + 1}) ${member.character.background.name}, ${member.character.grimoire.magicName}, ${member.rank.name}`;
            caption += item;
        });
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Сортировать по рангу',
                        'SORT_BY_RANK'
                    ),
                    Markup.button.callback(
                        'Сортировать по должности',
                        'SORT_BY_JOB_TITLE'
                    ),
                ],
                [
                    Markup.button.callback(
                        'Сортировать по имени',
                        'SORT_BY_NAME'
                    ),
                    Markup.button.callback(
                        'Сортировать по отряду',
                        'SORT_BY_SQUAD'
                    ),
                ],
                [Markup.button.callback('Изменить ранг', 'CHANGE_RANK')],
                [Markup.button.callback('Наградить из казны', 'REWARD')],
            ]),
        });
    }

    @Hears(SHOW_SQUAD_REQUESTS_BUTTON)
    async squadRequests(@Ctx() ctx: BotContext) {
        this.showArmedForcesRequest(ctx);
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

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');

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
                case 'CHANGE_RANK': {
                    await ctx.reply('Изменить ранг');
                    const ranks =
                        await this.squadsService.findRanksByArmedForces(
                            ctx.session.armedForcesId
                        );
                    console.log(ranks);
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
