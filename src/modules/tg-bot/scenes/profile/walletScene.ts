import { Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { MONEY_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { CharacterService } from '../../../character/services/character.service';

@Scene(SceneIds.wallet)
@UseFilters(TelegrafExceptionFilter)
export class WalletScene {
    constructor(private readonly characterService: CharacterService) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const user = await this.characterService.getWalletByCharacter(
            sender.id
        );
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
                ...Markup.keyboard([[BUTTON_ACTIONS.back]]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.profile);
    }
}
