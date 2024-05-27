import {
    Action,
    Command,
    Ctx,
    Message,
    On,
    SceneEnter,
    Sender,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';

import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ProblemService } from 'src/modules/judicial.system/services/problem.service';
import { CharacterService } from 'src/modules/character/services/character.service';
import {
    ENUM_PROBLEM_STATUS,
    ProblemType,
} from 'src/modules/judicial.system/entity/problem.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
@Wizard(ENUM_SCENES_ID.CREATE_REQUEST_TO_PARLAMENT_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class RequestToParlamentWizard {
    constructor(
        private readonly problemService: ProblemService,
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        ctx.scene.session.createdProblemId = null;
        await ctx.reply(
            `Ввведите текст обращения. Для отмены ввода введите /cancel.`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    @WizardStep(1)
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(
        @Ctx() ctx: BotContext,
        @Message() message,
        @Sender() sender
    ) {
        const text = message.text;
        const character = await this.characterService.getCharacterIdByTgId(
            sender.id
        );
        let problem = null;
        if (ctx.scene.session.createdProblemId) {
            problem = await this.problemService.changeProblemContent(
                ctx.scene.session.createdProblemId,
                text
            );
        } else {
            problem = await this.problemService.createProblem(
                character,
                ProblemType.Traditional,
                text
            );
        }
        const caption = `Ваш текст обращения: ${text}`;
        await ctx.reply(caption, {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Редакитровать обращение',
                        `EDIT_TEXT`
                    ),
                    Markup.button.callback(
                        'Отправить в приёмную',
                        `SEND_MESSAGE:${problem.id}`
                    ),
                ],
            ]),
        });
        ctx.wizard.next();
    }

    @Action('EDIT_TEXT')
    @WizardStep(2)
    async editText(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `Ввведите текст обращения. Для отмены ввода введите /cancel.`
        );
        ctx.wizard.back();
    }

    @Action(/^(SEND_MESSAGE.*)$/)
    @On('callback_query')
    @WizardStep(2)
    async sendMessage(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const problemId = ctx.callbackQuery.data.split(':')[1];
            if (problemId) {
                const newProblem = await this.problemService.changeProblemState(
                    problemId,
                    ENUM_PROBLEM_STATUS.PENDING
                );
                if (newProblem.status === ENUM_PROBLEM_STATUS.PENDING) {
                    await ctx.reply(
                        `Ваше обращение принято. С вами свяжутся для принятия судебного решения. За статусом вашей проблемы можете проследить во вкладке "⚖️Мои судебные заявки"`
                    );
                    await ctx.scene.enter(
                        ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID
                    );
                }
            }
        }
        // await ctx.scene.enter(ENUM_SCENES_ID.magicParlament);
    }
    @Action('CANCEL')
    @WizardStep(2)
    async cancel2(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MAGIC_PARLAMENT_SCENE_ID);
    }
}
