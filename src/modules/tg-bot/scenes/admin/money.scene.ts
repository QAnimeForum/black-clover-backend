import {
    Action,
    Ctx,
    Hears,
    InjectBot,
    Scene,
    SceneEnter,
    TELEGRAF_STAGE,
} from 'nestjs-telegraf';

import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, Injectable, Logger, UseFilters } from '@nestjs/common';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';

import {
    BACK_BUTTON,
    FINE_MONEY_BUTTON,
    GIVE_MONEY_BUTTON,
    TRANSACTIONS_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { message } from 'telegraf/filters';
import { UserService } from 'src/modules/user/services/user.service';
import { WalletService } from 'src/modules/money/wallet.service';
import { TgBotService } from '../../services/tg-bot.service';
import { MoneyLogEntity } from 'src/modules/money/entity/money.logs.entity';
import * as xlsx from 'xlsx';
@Scene(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminMoneyScene {
    constructor(
        private readonly walletService: WalletService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        ctx.reply('Управление финансами', {
            ...Markup.keyboard([
                [TRANSACTIONS_BUTTON],
                [GIVE_MONEY_BUTTON, FINE_MONEY_BUTTON],
                [BACK_BUTTON],
            ]).resize(),
        });
    }

    @Hears(GIVE_MONEY_BUTTON)
    async giveMoney(@Ctx() ctx: BotContext) {
        await ctx.reply('способ выдать деньги', {
            ...Markup.inlineKeyboard([
                Markup.button.callback(
                    'Выдать деньги по id',
                    'GIVE_MONEY_BY_ID'
                ),
            ]),
        });
        // await ctx.scene.enter(ENUM_SCENES_ID.GIVE_MONEY_SCENE_ID);
    }

    @Hears(TRANSACTIONS_BUTTON)
    async allTransactions(@Ctx() ctx: BotContext) {
        const transactions = await this.walletService.findAllTransactions();
        const workSheet = xlsx.utils.json_to_sheet(transactions);
        const workBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');

        const buffer = xlsx.write(workBook, {
            bookType: 'xlsx',
            type: 'buffer',
        });
        await ctx.replyWithDocument({
            source: buffer,
            filename: `Транзакцции.xlsx`,
        });
    }

    @Hears(FINE_MONEY_BUTTON)
    async fineMoney(@Ctx() ctx: BotContext) {
        await ctx.reply('способ оштрафовать деньги', {
            ...Markup.inlineKeyboard([
                Markup.button.callback('Оштрафовать по id', 'FINE_MONEY_BY_ID'),
            ]),
        });
        // await ctx.scene.enter(ENUM_SCENES_ID.GIVE_MONEY_SCENE_ID);
    }

    @Action('GIVE_MONEY_BY_ID')
    async giveMoneyById(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.GIVE_MONEY_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}

@Injectable()
export class AddMoneyWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly walletService: WalletService,
        private readonly userService: UserService,
        private readonly tgBotService: TgBotService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.GIVE_MONEY_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3()
        );

        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
            this.tgBotService.catchException(err, ctx, this.logger);
        });
    }

    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.moneyInfo = {
                adminId: 0,
                tgId: 0,
                copper: 0,
                silver: 0,
                electrum: 0,
                gold: 0,
                platinum: 0,
            };
            await ctx.reply(
                `🧟 Введи  ID игрока, которого хотите назначить админом.\n🦝 Если игрока не находит, то ему нужно прописать /start в боте!`
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const tgId = ctx.update.message.text;
            const isUserExists = await this.userService.exists(tgId);
            if (!isUserExists) {
                ctx.reply(
                    'Введен не верный id пользователя! Для отмены нажмите кнопку отменить /cancel'
                );
                ctx.wizard.back();
            } else {
                ctx.scene.session.moneyInfo.adminId =
                    ctx.update.message.from.id;
                ctx.scene.session.moneyInfo.tgId = Number.parseInt(
                    ctx.update.message.text
                );
                console.log(ctx.update.message.text);
                await ctx.reply(
                    `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
                );
                ctx.wizard.next();
            }
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const array = ctx.update.message.text.split(' ');
            if (array.length !== 5) {
                ctx.reply(
                    'Введено не 5 чисел. \nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const isAllItemsInteger = array.every((item) =>
                Number.isInteger(item)
            );
            if (isAllItemsInteger) {
                ctx.reply(
                    'Не все введённые символы являются цифры.\nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const copperText = ` Медные: ${array[0]}\n`;
            const silverText = `Серебряные: ${array[1]}\n`;
            const electrumText = `Электрумовые: ${array[2]}\n`;
            const goldText = `Золотые: ${array[3]}\n`;
            const platinumText = `Платиновые: ${array[4]}\n`;
            ctx.scene.session.moneyInfo.copper = Number.parseInt(array[0]);
            ctx.scene.session.moneyInfo.silver = Number.parseInt(array[1]);
            ctx.scene.session.moneyInfo.electrum = Number.parseInt(array[2]);
            ctx.scene.session.moneyInfo.gold = Number.parseInt(array[3]);
            ctx.scene.session.moneyInfo.platinum = Number.parseInt(array[4]);
            const caption =
                `Вы хотите перевести такую сумму:\n` +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText +
                'по id: ' +
                ctx.scene.session.moneyInfo.tgId;
            ctx.reply(caption, {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Да', 'yes')],
                    [Markup.button.callback('Изменить сумму', 'CHANGE_MONEY')],
                    //     [Markup.button.callback('Изменить id', 'CHANGE_ID')],
                    [Markup.button.callback('Отменить перевод', 'CANCEL')],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
        });
        composer.action('yes', async (ctx) => {
            // this.moneyService
            const copperText = ` Медные: ${ctx.scene.session.moneyInfo.copper}\n`;
            const silverText = `Серебряные: ${ctx.scene.session.moneyInfo.copper}\n`;
            const electrumText = `Электрумовые: ${ctx.scene.session.moneyInfo.copper} \n`;
            const goldText = `Золотые: ${ctx.scene.session.moneyInfo.copper}\n`;
            const platinumText = `Платиновые: ${ctx.scene.session.moneyInfo.copper}\n`;
            const tg = ctx.scene.session.moneyInfo.tgId;
            await this.walletService.addCharacterMoney(
                ctx.scene.session.moneyInfo
            );
            const caption =
                'Вы перевели ' +
                tg +
                ' такое количество денег:\n' +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;
            await ctx.reply(caption);
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
        });

        composer.action('CHANGE_MONEY', async (ctx) => {
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.back();
            ctx.wizard.selectStep(1);
        });
        composer.action('CANCEL', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
        });
        return composer;
    }
}
