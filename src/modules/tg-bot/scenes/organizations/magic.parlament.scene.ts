import {
    Action,
    Command,
    Ctx,
    Hears,

    Scene,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { PARLAMENT } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import {
    ENUM_PROBLEM_STATUS,
    ProblemEntity,
    ProblemType,
} from 'src/modules/judicial.system/entity/problem.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    ALL_COURY_CASE_BUTTON,
    BACK_BUTTON,
    MY_COURY_CASE_BUTTON,
    PRIAZON_BUTTON,
    REQUEST_TO_PARLAMENT_BUTTON,
} from '../../constants/button-names.constant';

@Scene(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor(
        private readonly problemSystemService: ProblemService,
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const title = `<strong><u>Магический парламент</u></strong>`;
        const workingHours = `<strong>Время работы</strong>\nЗаявки можно подавать круглосуточно. Будут рассматриваться по мере возможности.`;
        const allCourtCase = `<strong>Количество всех дел</strong>:`;
        const myCourtCase = `<strong>Количество моих заявок в суд</strong>:`;
        const yourAllFines = `<strong>Количество всех штрафов</strong>:`;
        const yourCurrentFines = `<strong>Количество текущих штрафов</strong>:`;
        const priazonStatus = `<strong>Находитесь ли вы в тюрьме</strong>: нет`;
        const caption = `${title}\n\n${workingHours}\n\n${allCourtCase}\n${myCourtCase}\n${yourAllFines}\n${yourCurrentFines}\n${priazonStatus}\n`;
        ctx.sendPhoto(
            {
                source: PARLAMENT,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [
                        REQUEST_TO_PARLAMENT_BUTTON,
                        //BUTTON_ACTIONS.PRIAZON,
                    ],
                    [ALL_COURY_CASE_BUTTON, MY_COURY_CASE_BUTTON],
                    [BACK_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(ALL_COURY_CASE_BUTTON)
    async allCouryCase(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    @Hears(MY_COURY_CASE_BUTTON)
    async myCouryCase(@Ctx() ctx: BotContext, @Sender("id") tgId) {;
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
    async rquestToParlament(@Ctx() ctx: BotContext) {
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