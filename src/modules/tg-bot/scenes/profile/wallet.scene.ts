import { Hears, Scene, SceneEnter, Sender, Context } from 'nestjs-telegraf';
import { MONEY_IMAGE_PATH } from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { BACK_BUTTON } from '../../constants/button-names.constant';
import { WalletService } from 'src/modules/character/services/wallet.service';

@Scene(ENUM_SCENES_ID.WALLET_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class WalletScene {
    constructor(
        private readonly walletService: WalletService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Context() ctx: BotContext, @Sender('id') tgId) {
        const user = await this.walletService.findWalletByUserTgId(tgId);
        const wallet = user.character.wallet;
        const cash = wallet.cash;
        const cooperText = ` Медные: ${cash.cooper}\n`;
        const silverText = `Серебряные: ${cash.silver}\n`;
        const electrumText = `Электрумовые: ${cash.eclevtrum}\n`;
        const goldTextText = `Золотые: ${cash.gold}\n`;
        const platinumText = `Платиновые: ${cash.platinum}\n`;
        const caption = `👛Мой кошелёк\n\n💵Наличные\n\n${cooperText}${silverText}${electrumText}${goldTextText}${platinumText}`;
        await ctx.sendPhoto(
            {
                source: MONEY_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([[BACK_BUTTON]]).resize(),
            }
        );
    }

    @Hears(BACK_BUTTON)
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
