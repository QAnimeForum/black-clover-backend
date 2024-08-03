import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ARMED_FORCES_RANKS_BUTTON,
    BACK_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
} from '../../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { PaginateQuery } from 'nestjs-paginate';
import { ArmedForcesRankEntity } from 'src/modules/squards/entity/armed.forces.rank.entity';

@Scene(ENUM_SCENES_ID.ADMIN_ARMED_FORCES_MAGIC_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminArmedForcesScene {
    constructor(
        private readonly squadsService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const selectedId = ctx.session.adminSelectedArmedForcesId;
        console.log(selectedId);
        const armedForces =
            await this.squadsService.findArmedForcesById(selectedId);
        const caption = `Админка армии ${armedForces.name}\n${armedForces.state.name}\n${armedForces.descripiton}`;
        const keyboardButtons = [];
        keyboardButtons.push([
            ARMED_FORCES_RANKS_BUTTON,
            SHOW_SQUAD_REQUESTS_BUTTON,
            PEOPLE_MANAGEMENT_BUTTON,
        ]);
        keyboardButtons.push([BACK_BUTTON]);
        await ctx.reply(caption, {
            ...Markup.keyboard(keyboardButtons).resize(),
        });
    }

    @Hears(SHOW_SQUAD_REQUESTS_BUTTON)
    async squadRequests(@Ctx() ctx: BotContext) {
        await this.showArmedForcesRequest(ctx);
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
        });
    }

    @Hears(ARMED_FORCES_RANKS_BUTTON)
    async showRanks(@Ctx() ctx: BotContext) {
        const armedForcesId = ctx.session.adminSelectedArmedForcesId;
        /**
 *         const ranks = await this.squadsService.findAllRanks({
            path: '',
            filter: {
                armedForcesId: `$eq:${armedForcesId}`,
            },
        });
 */
        const rank =
            await this.squadsService.findRanksByArmedForces(armedForcesId);
        console.log(rank);
        let caption = '<strong>Ранги</strong>\n';
        caption += this.showRankInfo(rank);
        caption += this.showRanksInfo(rank.children);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
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
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        ctx.session.adminSelectedArmedForcesId = null;
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
