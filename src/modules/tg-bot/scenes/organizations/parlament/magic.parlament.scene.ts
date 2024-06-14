import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';

import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import { ProblemEntity } from 'src/modules/judicial.system/entity/problem.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';
import { UserService } from 'src/modules/user/services/user.service';
import {
    MAGICAL_PARLIAMENT_BUTTON,
    REQUEST_TO_PARLAMENT_BUTTON,
    BACK_BUTTON,
    MY_COURY_CASE_BUTTON,
    PRIAZON_BUTTON,
    ALL_COURY_CASE_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { PARLAMENT } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import {
    convertParlamentInfoToText,
    problemToText,
    probmlemListButtons,
} from 'src/modules/tg-bot/utils/parlament.utils';

@Scene(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor(
        private readonly problemService: ProblemService,
        private readonly userService: UserService,
        private readonly courtWorkerService: CourtWorkerService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            this.showPrivateParlamentInfo(ctx);
        } else {
            this.showPublicParlamentInfo(ctx);
        }
    }

    @Hears(MAGICAL_PARLIAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext) {
        this.showPrivateParlamentInfo(ctx);
    }

    async showPrivateParlamentInfo(ctx: BotContext) {
        const numberOfAllCourtCases = await this.problemService.countProblems();
        const numberOfMyCourtCases = await this.problemService.countProblems();
        const curtWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        const caption = convertParlamentInfoToText(
            numberOfAllCourtCases,
            numberOfMyCourtCases,
            curtWorkers
        );

        await ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [REQUEST_TO_PARLAMENT_BUTTON],
                    [MAGICAL_PARLIAMENT_BUTTON, ALL_COURY_CASE_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }
    async showPublicParlamentInfo(ctx: BotContext) {
        const numberOfAllCourtCases = await this.problemService.countProblems();
        const numberOfMyCourtCases = await this.problemService.countProblems();
        const curtWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        const text = convertParlamentInfoToText(
            numberOfAllCourtCases,
            numberOfMyCourtCases,
            curtWorkers
        );

        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
        });
        const [problemsText, buttons] = probmlemListButtons(problems);
        const caption = `${text}${problemsText}`;
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );

        ctx.answerCbQuery();
    }
    @Action(/^(PROBLEMS_NEXT_PAGE.*)$/)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: page,
        });

        const [caption, buttons] = probmlemListButtons(problems);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(PROBLEMS_PREVIOUS_PAGE.*)$/)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: page,
        });
        const [caption, buttons] = probmlemListButtons(problems);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^(PROBLEM.*)$/)
    async showProblem(@Ctx() ctx: BotContext) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const problem = await this.problemService.findProblemById(problemId);
        const caption = problemToText(problem);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                Markup.button.callback(BACK_BUTTON, BACK_BUTTON),
            ]),
        });
    }

    @Action(BACK_BUTTON)
    async backToProblemsList(@Ctx() ctx: BotContext) {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
        });
        const [caption, buttons] = probmlemListButtons(problems);
        ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Hears(ALL_COURY_CASE_BUTTON)
    async allProblemsList(@Ctx() ctx: BotContext) {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
        });
        const [caption, buttons] = probmlemListButtons(problems);
        console.log(caption, buttons);
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Hears(MY_COURY_CASE_BUTTON)
    async myCouryCase(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        /* const problems = await this.problemSystemService.findAllProblems({
            limit: 20,
            path: '',
            filter: {
                creatorId: `$eq:${character.id}`,
            },
        });*/
        const problems: Array<ProblemEntity> = [];
        let caption = '';
        problems.map(
            (problem, index) =>
                (caption += `${index + 1})Заявка №${problem.displayId}: ${problem.content.substring(0, 8)}... <strong>Статус</strong>: ${problem.status}\n`)
        );
        ctx.reply(caption, {
            parse_mode: 'HTML',
        });
    }
    @Hears(REQUEST_TO_PARLAMENT_BUTTON)
    async requestToParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(
            ENUM_SCENES_ID.CREATE_REQUEST_TO_PARLAMENT_SCENE_ID
        );
    }

    @Hears(PRIAZON_BUTTON)
    async priazon(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}
