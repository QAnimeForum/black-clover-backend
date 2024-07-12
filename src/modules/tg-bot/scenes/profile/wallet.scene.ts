import {
    Hears,
    Scene,
    SceneEnter,
    Sender,
    Context,
    Action,
} from 'nestjs-telegraf';
import { EXCHANGE_RATES_PATH, MONEY_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import {
    BACK_BUTTON,
    EXCHANGE_RATES_BUTTON,
    TRANSFER_MONEY_BUTTON,
    WALLET_BUTTON,
} from '../../constants/button-names.constant';
import { WalletService } from 'src/modules/money/wallet.service';
import { walletToText } from '../../utils/profile.utils';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';

@Scene(ENUM_SCENES_ID.WALLET_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class WalletScene {
    constructor(
        private readonly walletService: WalletService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    async showWalletInformation(ctx: BotContext, tgId: any) {
        const wallet = await this.walletService.findWalletByUserTgId(tgId);
        const caption = walletToText(wallet);
        if (ctx.chat.type == 'private') {
            await ctx.sendPhoto(
                {
                    source: MONEY_IMAGE_PATH,
                },
                {
                    caption,
                    ...Markup.keyboard([
                        [EXCHANGE_RATES_BUTTON, TRANSFER_MONEY_BUTTON],
                        [WALLET_BUTTON, BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.answerCbQuery();
            await ctx.deleteMessage();
            await ctx.sendPhoto(
                {
                    source: MONEY_IMAGE_PATH,
                },
                {
                    caption,
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }
    @SceneEnter()
    async enter(@Context() ctx: BotContext, @Sender('id') tgId) {
        await this.showWalletInformation(ctx, tgId);
    }

    @Hears(EXCHANGE_RATES_BUTTON)
    async exchangeRates(@Context() ctx: BotContext) {
        const rateText =
            '<strong>Курс валюты</strong>\n 1 платиновая (🪙) = 10 золотых (🟡)\n 1 золотой (🟡) = 2 электрумовых(🔵)\n 1 электрумовая (🔵) = 5 серебрянных(⚪️)\n 1 серебряная (⚪️) = 10 медных (🟤)\n\n';

        const title = '|Монета|ММ|СМ|ЭМ|ЗМ|ПМ\n';
        const delimeter =
            '|----------|:-------------:|------:|------:|------:|------:|';
        const copperText = `|🟤Медная (мм)|	        1|	  1/10|	1/50|	1/100|	1/1,000|\n`;
        const silverText = `⚪️Серебрянная (см)	10	   1	1/5	1/10	1/100\n`;
        const electrumText = `🔵Электрумовая (эм)	50   5	1	1/2	1/20\n`;
        const goldText = `🟡Золотая (зм)	100	    10	    2   1	1/10\n`;
        const platinumText = `🪙 Платиновая (пм)	1,000	100	20	10	1\n\n`;
        let caption = rateText;
        caption += '1 🪙 = 10 🟡 = 20 🔵 = 100 ⚪️ = 1000 🟤';
        await ctx.sendPhoto(
            {
                source: EXCHANGE_RATES_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
            }
        );
    }
    @Hears(WALLET_BUTTON)
    async wallet(@Context() ctx: BotContext, @Sender('id') tgId) {
        await this.showWalletInformation(ctx, tgId);
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION)
    @Hears(BACK_BUTTON)
    async profile(@Context() ctx: BotContext) {
        await ctx.deleteMessage();
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
