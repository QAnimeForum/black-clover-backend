import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { BotContext } from '../../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ADD_JUDICIAL_OFFICER_BUTTON,
    BACK_BUTTON,
    JUDICIAL_OFFICER_BUTTON,
    REMOVE_JUDICIAL_OFFICER_BUTTON,
} from '../../constants/button-names.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';
import { PARLAMENT } from '../../constants/images';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';

@Scene(ENUM_SCENES_ID.ADMIN_MAGIC_PARLAMENT_SCENE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminMagicParlamentScene {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(CourtWorkerService)
        private readonly courtWorkerService: CourtWorkerService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Админка магического парламента';
        await ctx.reply(caption, {
            ...Markup.keyboard([
                [JUDICIAL_OFFICER_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(JUDICIAL_OFFICER_BUTTON)
    async workers(@Ctx() ctx: BotContext) {
        const grimoireWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        let caption = '<strong>Сотрудники башни гримуаров</strong>\n';
        grimoireWorkers.data.map((worker, index) => {
            caption += `${index + 1}) Имя: ${worker.character.background.name}, ID: <code>${worker.character.user.tgUserId}</code>\n`;
        });

        if (grimoireWorkers.data.length == 0) {
            caption +=
                'В суде никто пока не работает, большое упущение!\nВы можете добавить новых работников\n';
        }

        await ctx.replyWithPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            ADD_JUDICIAL_OFFICER_BUTTON,
                            ENUM_ACTION_NAMES.ADD_JUDICIAL_OFFICER_ACTION
                        ),
                    ],
                    [
                        Markup.button.callback(
                            REMOVE_JUDICIAL_OFFICER_BUTTON,
                            ENUM_ACTION_NAMES.REMOVE_JUDICIAL_OFFICER_ACTION
                        ),
                    ],
                ]),
            }
        );
    }
    @Action(ENUM_ACTION_NAMES.ADD_JUDICIAL_OFFICER_ACTION)
    async addJudicialOfficer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.JUDICIAL_OFFICER_ADD_SCENE_ID);
    }


    @Action(ENUM_ACTION_NAMES.REMOVE_JUDICIAL_OFFICER_ACTION)
    async removeJudicialOfficer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.JUDICIAL_OFFICER_REMOVE_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
