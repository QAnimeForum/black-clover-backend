import { Ctx, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { SceneIds } from '../constants/scenes.id';
import { UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { UserService } from '../../user/services/user.service';
import { Markup } from 'telegraf';
import { LanguageTexts } from '../constants/language.text.constant';

@Scene(SceneIds.entry)
@UseFilters(TelegrafExceptionFilter)
export class EntryScene {
    constructor(private readonly userService: UserService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const telegramUserId = sender.id;
        console.log(telegramUserId);
        const isUserExist = await this.userService.exists(telegramUserId);
        if (isUserExist) {
            await ctx.scene.enter(SceneIds.home);
            return;
        }
        const caption = `Великая война, затронувшая все 4 королевства мира Чёрного клевера, закончилась 300 лет назад.\n\nВойска Люциуса Зогратиса тогда потерпели поражение в битве за столицу Королевства Клевер. Жизнь возвратилась в мирное русло, а о героях той войны, Асте и Юно, стали слагать легенды.\nОднако на горизонте появилась новая угроза.\n\nИз дальних уголков всех четырёх королевств доходят слухи о странных подземельях, оставленных далёкими предками, жившими тысячилетия назад на этой земле, о разломах, порождающих невиданных чудовищ, а также о появленнии новых Великих Магических Зон на нейтральных территориях, в которых очень опасно находиться.\n\nCейчас после той великой войны судьба дала жителям мира Чёрного клевера передышку, но надолго ли?\n\nСможете ли вы повлиять на исход будущих событий и встать в один ряд с сильными мира сего? Все в ваших руках…`;
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.removeKeyboard(),
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Начать путь', `ACTION_TRAVEL`)],
                ]),
            }
        );
    }

    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        if ('data' in ctx.callbackQuery) {
            const [action, value] = ctx.callbackQuery.data.split(':');
            switch (action) {
                case 'ACTION_TRAVEL': {
                    await ctx.scene.enter(SceneIds.createCharacter);
                }
            }
        }
    }
}
