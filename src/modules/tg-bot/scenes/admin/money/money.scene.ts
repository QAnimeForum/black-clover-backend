import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WalletService } from 'src/modules/money/wallet.service';
import * as xlsx from 'xlsx';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import {
    BACK_BUTTON,
    FINE_MONEY_BUTTON,
    GIVE_MONEY_BUTTON,
    TRANSACTIONS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
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
            filename: `Транзакции.xlsx`,
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
        await ctx.answerCbQuery();
        ctx.scene.enter(ENUM_SCENES_ID.GIVE_MONEY_SCENE_ID);
    }

    @Action('FINE_MONEY_BY_ID')
    async fineMoneyById(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        console.log('wtf');
        ctx.scene.enter(ENUM_SCENES_ID.FINE_MONEY_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
}
