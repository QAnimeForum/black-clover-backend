import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';

import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import {
    ENUM_PROBLEM_STATUS,
    ProblemEntity,
} from 'src/modules/judicial.system/entity/problem.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';
import { UserService } from 'src/modules/user/services/user.service';
import {
    MAGICAL_PARLIAMENT_BUTTON,
    REQUEST_TO_PARLAMENT_BUTTON,
    COURY_CASE_LIST_BUTTON,
    BACK_BUTTON,
    MY_COURY_CASE_BUTTON,
    PRIAZON_BUTTON,
    ALL_COURY_CASE_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { PARLAMENT } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';

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
        await this.showParlamentInfo(ctx);
    }

    @Hears(MAGICAL_PARLIAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext) {
        await this.showParlamentInfo(ctx);
    }

    async showParlamentInfo(ctx: BotContext) {
        const numberOfCourtCases = await this.problemService.countProblems();
        const curtWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        const title = `<strong><u>Магический парламент</u></strong>`;
        const workingHours = `<strong>Время работы</strong>\n По согласованию.`;
        let workers = `<strong>Судьи</strong>\n`;
        curtWorkers.data.map((worker, index) => {
            workers += `${index}) ${worker.character.background.name}\n`;
        });
        if (curtWorkers.data.length == 0) {
            workers +=
                'Судей пока нет. Но вы можете стать судьёй и разбирать заявки! (заявки подаются через админов)\n';
        }
        const allCourtCase = `<strong>Количество всех дел</strong>: ${numberOfCourtCases}`;
        const myCourtCase = `<strong>Количество моих заявок в суд</strong>:`;
        const yourAllFines = `<strong>Количество всех штрафов</strong>:`;
        const yourCurrentFines = `<strong>Количество текущих штрафов</strong>:`;
        const priazonStatus = `<strong>Находитесь ли вы в тюрьме</strong>: нет`;
        const caption = `${title}\n\n${workingHours}\n${workers}\n\n${allCourtCase}\n${myCourtCase}\n${yourAllFines}\n${yourCurrentFines}\n${priazonStatus}\n`;
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
                    //           [ALL_COURY_CASE_BUTTON, MY_COURY_CASE_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    async showProblemList(
        page: number
    ): Promise<[string, InlineKeyboardButton[][]]> {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: page,
        });
        const caption = `Судебные дела\n\n Общее количество дел: ${problems.meta.totalItems}`;
        const buttons = [];
        problems.data.map((problem: ProblemEntity) => {
            // caption += `${problem.displayId}\n`;
            buttons.push([
                Markup.button.callback(
                    `Дело №${problem.displayId}. Статус: ${this.convertStatusToString(problem.status)}. ${problem.content}`,
                    `PROBLEM:${problem.id}`
                ),
            ]);
        });
        if (problems.meta.totalPages == 0) {
            buttons.push([Markup.button.callback(`1 из 1`, `PAGE`)]);
        } else if (page == 1 && problems.meta.totalPages == 1) {
            buttons.push([
                Markup.button.callback(
                    `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                    `PAGE`
                ),
            ]);
        } else if (page == 1 && problems.meta.totalPages > 1) {
            buttons.push([
                Markup.button.callback(
                    `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                    `PAGE`
                ),
                Markup.button.callback(`>>`, `NEXT_PAGE:${page + 1}`),
            ]);
        } else if (problems.meta.currentPage == problems.meta.totalPages) {
            buttons.push([
                Markup.button.callback(`<<`, `PREVIOUS_PAGE:${page - 1}`),
                Markup.button.callback(
                    `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                    `PAGE`
                ),
            ]);
        } else {
            buttons.push([
                Markup.button.callback(`<<`, `PREVIOUS_PAGE:${page - 1}`),
                Markup.button.callback(
                    `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                    `PAGE`
                ),
                Markup.button.callback(`>>`, `NEXT_PAGE:${page + 1}`),
            ]);
        }
        buttons.push([
            Markup.button.callback(`Все дела`, `ALL_PROBLEMS`),
            Markup.button.callback(`Мои заявки`, `MY_PROBLEMS`),
        ]);
        buttons.push([
            Markup.button.callback(`Все решённые дела`, `ALL_PROBLEMS`),
            Markup.button.callback(`Все нерешённые дела`, `MY_PROBLEMS`),
        ]);
        buttons.push([
            Markup.button.callback(`Мои решённые дела`, `ALL_PROBLEMS`),
            Markup.button.callback(`Мои нерешённые дела`, `MY_PROBLEMS`),
        ]);
        return [caption, buttons];
    }

    convertStatusToString(status: ENUM_PROBLEM_STATUS) {
        switch (status) {
            case ENUM_PROBLEM_STATUS.DRAFT:
                return 'черновик';
            case ENUM_PROBLEM_STATUS.PENDING:
                return 'на рассмотрении';
            case ENUM_PROBLEM_STATUS.SOLVED:
                return 'вынесено решение';
            default:
                return 'не определено';
        }
    }
    @Action(/^(NEXT_PAGE.*)$/)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const [caption, buttons] = await this.showProblemList(page);
        ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(PREVIOUS_PAGE.*)$/)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);
        const [caption, buttons] = await this.showProblemList(page);
        ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^(PROBLEM.*)$/)
    async showProblem(@Ctx() ctx: BotContext) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const problem = await this.problemService.findProblemById(problemId);

        const caption = `<strong>Дело № ${problem.displayId}</strong>\n<strong>Статус:</strong> ${this.convertStatusToString(problem.status)}\n<strong>Заявитель:</strong> ${problem.creator.background.name}\n${problem.content}`;
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                Markup.button.callback(BACK_BUTTON, BACK_BUTTON),
            ]),
        });
    }

    @Action(BACK_BUTTON)
    async backToProblemsList(@Ctx() ctx: BotContext) {
        const [caption, buttons] = await this.showProblemList(1);
        await ctx.editMessageText(caption, {
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Hears(ALL_COURY_CASE_BUTTON)
    async allProblemsList(@Ctx() ctx: BotContext) {
        const [caption, buttons] = await this.showProblemList(1);
        await ctx.reply(caption, {
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
