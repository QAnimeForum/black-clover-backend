import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    BACK_BUTTON,
    PEOPLE_MANAGEMENT_BUTTON,
    SHOW_SQUAD_REQUESTS_BUTTON,
} from '../../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SquadsService } from 'src/modules/squards/service/squads.service';
import { ArmedForcesRequestEntity } from 'src/modules/squards/entity/armed.forces.request.entity';
import { PaginateQuery } from 'nestjs-paginate';

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
        const armedForces =
            await this.squadsService.findArmedForcesById(selectedId);
        console.log(armedForces);
        const caption = `Админка армии ${armedForces.name}\n${armedForces.state.name}\n${armedForces.descripiton}`;
        const keyboardButtons = [];
        keyboardButtons.push([
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

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
