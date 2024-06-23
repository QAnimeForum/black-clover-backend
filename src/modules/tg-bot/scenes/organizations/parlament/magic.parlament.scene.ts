import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';

import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import { ENUM_PROBLEM_STATUS, ProblemEntity } from 'src/modules/judicial.system/entity/problem.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { CourtWorkerService } from 'src/modules/judicial.system/services/court.worker.service';
import {
    MAGICAL_PARLIAMENT_BUTTON,
    REQUEST_TO_PARLAMENT_BUTTON,
    BACK_BUTTON,
    MY_COURY_CASE_BUTTON,
    PRIAZON_BUTTON,
    ALL_COURY_CASE_BUTTON,
    JUDGE_OFFICE_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { PARLAMENT } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import {
    convertParlamentInfoToText,
    getProblemList,
    problemToText,
    probmlemListButtons,
} from 'src/modules/tg-bot/utils/parlament.utils';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';

@Scene(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor(
        private readonly problemService: ProblemService,
        private readonly characterService: CharacterService,
        private readonly courtWorkerService: CourtWorkerService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            this.showPrivateParlamentInfo(ctx, sender.id);
        } else {
            await this.showPublicParlamentInfo(ctx, sender.id);
        }
    }

    async showPrivateParlamentInfo(ctx: BotContext, tgId: string) {
        const numberOfAllCourtCases = await this.problemService.countProblems();
        const numberOfMyCourtCases =
            await this.problemService.countMyProblems(tgId);
        const curtWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        const isWorker = await this.courtWorkerService.isWorker(tgId);
        const buttons = [
            [REQUEST_TO_PARLAMENT_BUTTON],
            [MAGICAL_PARLIAMENT_BUTTON, ALL_COURY_CASE_BUTTON],
        ];
        if (isWorker) {
            buttons.push([JUDGE_OFFICE_BUTTON, BACK_BUTTON]);
        } else {
            buttons.push([BACK_BUTTON]);
        }
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
                ...Markup.keyboard(buttons).resize(),
            }
        );
    }
    async showPublicParlamentInfo(ctx: BotContext, tgId: string) {
        const numberOfAllCourtCases = await this.problemService.countProblems();
        const numberOfMyCourtCases =
            await this.problemService.countMyProblems(tgId);
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
    }

    @Hears(REQUEST_TO_PARLAMENT_BUTTON)
    async requestToParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(
            ENUM_SCENES_ID.CREATE_REQUEST_TO_PARLAMENT_SCENE_ID
        );
    }
    @Hears(MAGICAL_PARLIAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext, @Sender() sender) {
        this.showPrivateParlamentInfo(ctx, sender.id);
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
    }

    @Hears(JUDGE_OFFICE_BUTTON)
    async judgeOfficeHears(@Ctx() ctx: BotContext) {
        await ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption: 'Офис суда',
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Мои текущие дела',
                            ENUM_ACTION_NAMES.WORKER_PROBLEMS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Взять дело в работу',
                            ENUM_ACTION_NAMES.PROBLEM_WORK
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.WORKER_PROBLEMS)
    async myProblems(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: `$eq:${worker.id}`,
            },
        });
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);
        await ctx.editMessageCaption(
            problemsText,
            Markup.inlineKeyboard(buttons)
        );
    }
    @Action(ENUM_ACTION_NAMES.PROBLEM_WORK)
    async getProblemForWork(@Ctx() ctx: BotContext, @Sender() sender) {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: '$null',
            },
        });
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);
        await ctx.editMessageCaption(
            problemsText,
            Markup.inlineKeyboard(buttons)
        );
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE)
    async judgeOfficeAction(@Ctx() ctx: BotContext) {
        await ctx.editMessageCaption(
            'Офис суда',
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Мои текущие дела',
                        ENUM_ACTION_NAMES.WORKER_PROBLEMS
                    ),
                ],
                [
                    Markup.button.callback(
                        'Взять дело в работу',
                        ENUM_ACTION_NAMES.PROBLEM_WORK
                    ),
                ],
            ])
        );
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_ALL_PROBLEMS)
    async backToAllProblemsList(@Ctx() ctx: BotContext) {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
        });
        const [caption, buttons] = probmlemListButtons(problems);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^(PROBLEM.*)$/)
    async showProblem(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const backAction = ctx.callbackQuery['data'].split(':')[2];
        const problem = await this.problemService.findProblemById(problemId);
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const caption = problemToText(problem);
        const buttons = [];

        if (
            problem?.judge?.character?.id == character.id &&
            problem.status == ENUM_PROBLEM_STATUS.UNDER_CONSIDERATION
        ) {
            ctx.session.problemId = problemId;
            buttons.push([
                Markup.button.callback(
                    'Вынести решение',
                    ENUM_ACTION_NAMES.CREATE_SOLVE_ACTION
                ),
            ]);
        }
        buttons.push([Markup.button.callback(BACK_BUTTON, backAction)]);
        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(ENUM_ACTION_NAMES.CREATE_SOLVE_ACTION)
    async solveProblem(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SOLVE_ACTION_SCENE_ID);
    }
    @Action(/^(ADD_PROBLEM_TO_WORK.*)$/)
    async addProblemToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        await this.courtWorkerService.addJudgeToProblem(
            character.id,
            problemId
        );
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: '$null',
            },
        });
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);

        await ctx.editMessageReplyMarkup({
            inline_keyboard: buttons,
        });
    }

    @Action(/^(REMOVE_PROBLEM_TO_WORK.*)$/)
    async removeProblemToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        await this.courtWorkerService.removeJudgeToProblem(problemId);
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: `$eq:${worker.id}`,
            },
        });
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);

        await ctx.editMessageReplyMarkup({
            inline_keyboard: buttons,
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}

/**
 * 
@Scene(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor(
        private readonly problemService: ProblemService,
        private readonly characterService: CharacterService,
        private readonly courtWorkerService: CourtWorkerService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const chatType = ctx.chat.type;
        if (chatType == 'private') {
            this.showPrivateParlamentInfo(ctx, sender.id);
        } else {
            await this.showPublicParlamentInfo(ctx);
        }
    }

    @Hears(MAGICAL_PARLIAMENT_BUTTON)
    async magicParlament(@Ctx() ctx: BotContext, @Sender() sender) {
        this.showPrivateParlamentInfo(ctx, sender.id);
    }

    async showPrivateParlamentInfo(ctx: BotContext, tgId: string) {
        const numberOfAllCourtCases = await this.problemService.countProblems();
        const numberOfMyCourtCases = await this.problemService.countProblems();
        const curtWorkers = await this.courtWorkerService.findAllWorkers({
            path: '',
        });
        const isWorker = await this.courtWorkerService.isWorker(tgId);
        const buttons = [
            [REQUEST_TO_PARLAMENT_BUTTON],
            [MAGICAL_PARLIAMENT_BUTTON, ALL_COURY_CASE_BUTTON],
        ];
        if (isWorker) {
            buttons.push([JUDGE_OFFICE_BUTTON, BACK_BUTTON]);
        } else {
            buttons.push([BACK_BUTTON]);
        }
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
                ...Markup.keyboard(buttons).resize(),
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
        //   await ctx.deleteMessage();
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
    async showProblem(@Ctx() ctx: BotContext, @Sender() sender) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const problem = await this.problemService.findProblemById(problemId);
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const caption = problemToText(problem);
        console.log(problem);
        await ctx.replyWithHTML(caption, {
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
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Hears(MY_COURY_CASE_BUTTON)
    async myCouryCase(@Ctx() ctx: BotContext, @Sender('id') tgId) {
         const problems = await this.problemSystemService.findAllProblems({
            limit: 20,
            path: '',
            filter: {
                creatorId: `$eq:${character.id}`,
            },
        });
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

    @Hears(JUDGE_OFFICE_BUTTON)
    async judgeOfficeHears(@Ctx() ctx: BotContext) {
        await ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption: 'Офис суда',
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Мои текущие дела',
                            'WORKER_PROBLEMS_ACTION'
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Взять дело в работу',
                            'GET_PROBLEM_FOR_WORK_ACTION'
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE)
    async judgeOfficeAction(@Ctx() ctx: BotContext) {
        await ctx.editMessageCaption(
            'Офис суда',
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Мои текущие дела',
                        'WORKER_PROBLEMS_ACTION'
                    ),
                ],
                [
                    Markup.button.callback(
                        'Взять дело в работу',
                        'GET_PROBLEM_FOR_WORK_ACTION'
                    ),
                ],
            ])
        );
    }
    @Action('WORKER_PROBLEMS_ACTION')
    async myProblems(@Ctx() ctx: BotContext, @Sender() sender) {
        ctx.answerCbQuery();
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: `$eq:${worker.id}`,
            },
        });
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);
        await ctx.editMessageCaption(
            problemsText,
            Markup.inlineKeyboard(buttons)
        );
    }
    @Action('GET_PROBLEM_FOR_WORK_ACTION')
    async getProblemForWork(@Ctx() ctx: BotContext, @Sender() sender) {
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: '$null',
            },
        });
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);
        await ctx.editMessageCaption(
            problemsText,
            Markup.inlineKeyboard(buttons)
        );
    }

    @Action(/^(ADD_PROBLEM_TO_WORK_ACTION.*)$/)
    async addProblemToWork(@Ctx() ctx: BotContext, @Sender() sender) {
        const problemId = ctx.callbackQuery['data'].split(':')[1];
        const character = await this.characterService.findCharacterByTgId(
            sender.id
        );
        const worker = await this.courtWorkerService.findWorkerById(
            character.id
        );
        await this.courtWorkerService.addJudgeToProblem(
            character.id,
            problemId
        );
        const problems = await this.problemService.findAllProblems({
            path: '',
            sortBy: [['displayId', 'ASC']],
            limit: 5,
            page: 1,
            filter: {
                judge: '$null',
            },
        });
        const [problemsText, buttons] = getProblemList(problems, worker);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.BACK_TO_PARLAMENT_OFFICE
            ),
        ]);

        await ctx.editMessageReplyMarkup({
            inline_keyboard: buttons,
        });
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }
}

 */
