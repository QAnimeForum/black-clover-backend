import {
    ProblemEntity,
    ENUM_PROBLEM_STATUS,
} from 'src/modules/judicial.system/entity/problem.entity';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Paginated } from 'nestjs-paginate';
import { CourtWorkerEntity } from 'src/modules/judicial.system/entity/court.worker.entity';

export const convertParlamentInfoToText = (
    numberOfAllCourtCases: number,
    numberOfMyCourtCases: number,
    curtWorkers: Paginated<CourtWorkerEntity>
) => {
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
                `PROBLEM:${problem.id}`
            ),
        ]);
    });
    if (problems.meta.totalPages == 0) {
        buttons.push([Markup.button.callback(`1 из 1`, `PAGE`)]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else if (currentPage == 1 && problems.meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `PROBLEMS_NEXT_PAGE:${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `PROBLEMS_PREVIOUS_PAGE:${currentPage - 1}`
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
                `PROBLEMS_PREVIOUS_PAGE:${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `PROBLEMS_NEXT_PAGE:${currentPage + 1}`
            ),
        ]);
    }
    /**
 *     buttons.push([
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
 */
    return [caption, buttons];
};

export const convertStatusToText = (status: ENUM_PROBLEM_STATUS) => {
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
};

export const problemToText = (problem: ProblemEntity) => {
    const caption = `<strong>Дело № ${problem.displayId}</strong>\n<strong>Статус:</strong> ${convertStatusToText(problem.status)}\n<strong>Заявитель:</strong> ${problem.creator.background.name}\n${problem.content}`;
    return caption;
};
