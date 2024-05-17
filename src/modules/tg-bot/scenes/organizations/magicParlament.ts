import {
    Action,
    Command,
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { PARLAMENT } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { ProblemSystemService } from 'src/modules/jobs/judicial.system/services/problem.system.service';

@Scene(SceneIds.magicParlament)
@UseFilters(TelegrafExceptionFilter)
export class MagicParlamentScene {
    constructor(private readonly problemSystemService: ProblemSystemService) {}
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
                        BUTTON_ACTIONS.ALL_COURY_CASE,
                        BUTTON_ACTIONS.MY_COURY_CASE,
                    ],
                    [
                        BUTTON_ACTIONS.REQUEST_TO_PARLAMENT,
                        BUTTON_ACTIONS.PRIAZON,
                    ],
                    [BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.ALL_COURY_CASE)
    async allCouryCase(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }

    @Hears(BUTTON_ACTIONS.MY_COURY_CASE)
    async myCouryCase(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }
    @Hears(BUTTON_ACTIONS.REQUEST_TO_PARLAMENT)
    async rquestToParlament(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.createRequestToParlament);
    }

    @Hears(BUTTON_ACTIONS.PRIAZON)
    async priazon(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }
    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.organizations);
    }
}

@Wizard(SceneIds.createRequestToParlament)
@UseFilters(TelegrafExceptionFilter)
export class RequestToParlamentWizard {
    constructor(private readonly problemSystemService: ProblemSystemService) {}
    @SceneEnter()
    async start(@Ctx() ctx: BotContext) {
        await ctx.reply(
            `Ввведите текст обращения. Для отмены ввода введите /cancel.`,
            Markup.removeKeyboard()
        );
    }

    @Command('cancel')
    @WizardStep(1)
    async cancel(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.magicParlament);
    }
    @On('text')
    @WizardStep(1)
    async getTgId(@Ctx() ctx: BotContext, @Message() message) {
        const text = message.text;
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
                        `SEND_MESSAGE`
                    ),
                ],
                [Markup.button.callback('Передумал', `CANCEL`)],
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

    @Action('SEND_MESSAGE')
    @WizardStep(3)
    async sendMessage(@Ctx() ctx: BotContext, @Message() message) {
        console.log(message);
        const caption = `Ваш текст обращения:${message}`;
        await ctx.reply(caption, {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Редакитровать обращение',
                        `EDIT_TEXT`
                    ),
                    Markup.button.callback(
                        'Отправить в приёмную',
                        `SEND_MESSAGE`
                    ),
                ],
                [Markup.button.callback('Передумал', `CANCEL`)],
            ]),
        });
        await ctx.scene.enter(SceneIds.magicParlament);
    }
    @Action('CANCEL')
    @WizardStep(2)
    async cancel2(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.magicParlament);
    }
}
