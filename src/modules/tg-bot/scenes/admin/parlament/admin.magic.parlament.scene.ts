import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import {
    JUDICIAL_OFFICER_BUTTON,
    BACK_BUTTON,
    ADD_JUDICIAL_OFFICER_BUTTON,
    REMOVE_JUDICIAL_OFFICER_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { PARLAMENT } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';

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
        const courtsWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        let caption = '<strong>Сотрудники магического парламента</strong>\n';
        courtsWorkers.data.map((worker, index) => {
            caption += `${index + 1}) Имя: ${worker.character.background.name}, ID: <code>${worker.character.user.tgUserId}</code>\n`;
        });

        if (courtsWorkers.data.length == 0) {
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
