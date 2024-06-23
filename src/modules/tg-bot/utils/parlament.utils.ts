import {
    ProblemEntity,
    ENUM_PROBLEM_STATUS,
} from 'src/modules/judicial.system/entity/problem.entity';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Paginated } from 'nestjs-paginate';
import { CourtWorkerEntity } from 'src/modules/judicial.system/entity/court.worker.entity';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { BotContext } from '../interfaces/bot.context';

export const convertParlamentInfoToText = (
    numberOfAllCourtCases: number,
    numberOfMyCourtCases: number,
    curtWorkers: Paginated<CourtWorkerEntity>
) => {
    const title = `<strong><u>Магический парламент</u></strong>`;
    const workingHours = `<strong>Время работы</strong>\n По согласованию.`;
    let workers = `<strong>Судьи</strong>\n`;
    curtWorkers.data.map((worker, index) => {
        workers += `${index + 1}) ${worker.character.background.name}\n`;
    });
    if (curtWorkers.data.length == 0) {
        workers +=
            'Судей пока нет. Но вы можете стать судьёй и разбирать заявки! (заявки подаются через админов)\n';
    }
    const allCourtCase = `<strong>Количество всех дел</strong>: ${numberOfAllCourtCases}`;
    const myCourtCase = `<strong>Количество моих заявок в суд</strong>: ${numberOfMyCourtCases}`;
    //  const yourAllFines = `<strong>Количество всех штрафов</strong>:`;
    //   const yourCurrentFines = `<strong>Количество текущих штрафов</strong>:`;
    //   const priazonStatus = `<strong>Находитесь ли вы в тюрьме</strong>: нет`;
    const caption = `${title}\n\n${workingHours}\n${workers}\n\n${allCourtCase}\n${myCourtCase}\n`;
    return caption;
};

export const probmlemListButtons = (
    problems: Paginated<ProblemEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = problems;
    const { currentPage, totalPages, totalItems } = meta;
    const caption = `Судебные дела\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((problem: ProblemEntity) => {
        // caption += `${problem.displayId}\n`;
        buttons.push([
            Markup.button.callback(
                `Дело №${problem.displayId}. Статус: ${convertStatusToText(problem.status)}. ${problem.content}`,
                `${ENUM_ACTION_NAMES.PROBLEM_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${problem.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.BACK_TO_ALL_PROBLEMS}`
            ),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && problems.meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.PROBLEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.PROBLEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                `PAGE`
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.PROBLEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.PROBLEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};

export const getProblemList = (
    problems: Paginated<ProblemEntity>,
    worker: CourtWorkerEntity
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = problems;
    const { currentPage, totalPages, totalItems } = meta;
    const caption = `Судебные дела\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((problem: ProblemEntity) => {
        if (problem.judge == null) {
            buttons.push([
                Markup.button.callback(
                    `Дело №${problem.displayId}. ${problem.content}`,
                    `${ENUM_ACTION_NAMES.PROBLEM_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${problem.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.PROBLEM_WORK}`
                ),
                Markup.button.callback(
                    `➕`,
                    `${ENUM_ACTION_NAMES.ADD_PROBLEM_TO_WORK_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${problem.id}`
                ),
            ]);
        } else if (problem.judge.id == worker.id) {
            buttons.push([
                Markup.button.callback(
                    `Дело №${problem.displayId}. ${problem.content}`,
                    `${ENUM_ACTION_NAMES.PROBLEM_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${problem.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.WORKER_PROBLEMS}`
                ),
                Markup.button.callback(
                    `➖`,
                    `${ENUM_ACTION_NAMES.REMOVE_PROBLEM_TO_WORK_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${problem.id}`
                ),
            ]);
        }
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && problems.meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.PROBLEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.PROBLEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                `PAGE`
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.PROBLEMS_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.PROBLEMS_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};
export const convertStatusToText = (status: ENUM_PROBLEM_STATUS) => {
    switch (status) {
        case ENUM_PROBLEM_STATUS.DRAFT:
            return 'черновик';
        case ENUM_PROBLEM_STATUS.PENDING:
            return 'заявка в суде';
        case ENUM_PROBLEM_STATUS.UNDER_CONSIDERATION:
            return 'заявку судья взял на рассмотрение';
        case ENUM_PROBLEM_STATUS.SOLVED:
            return 'вынесено решение';
        default:
            return 'не определено';
    }
};

export const problemToText = (problem: ProblemEntity) => {
    // const caption = `${problem.content}`;
    let caption = `<strong>Дело № ${problem.displayId}</strong>\n`;
    caption += `<strong>Статус:</strong> ${convertStatusToText(problem.status)}\n`;
    caption += `<strong>Заявитель:</strong> ${problem.creator.background.name}\n`;
    caption += `<strong>Судья:</strong> ${problem.judge ? problem.judge.character.background.name : 'пока не назначен'}\n`;
    caption += `<strong>Текст заявки</strong>\n${problem.content}\n`;
    caption += `<strong>Решение</strong>\n ${problem.submission ? problem.submission.content : 'пока не вынесено'}\n`;
    return caption;
};
