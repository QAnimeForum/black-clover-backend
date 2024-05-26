import { Action, Ctx, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { Inject, Logger, UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { UserService } from '../../user/services/user.service';
import { Markup } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LOGGER_EXCEPTION } from '../utils/logger';
import { CALLBACK_QUERY_ACTIONS } from '../constants/callback.query.actions.enum';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
@Scene(ENUM_SCENES_ID.START_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class EntryScene {
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') senderId) {
        const isUserExist = await this.userService.exists(senderId);
        if (isUserExist) {
            ctx.session.user = await this.userService.findUserById(senderId);
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        ctx.reply(undefined, { reply_markup: { remove_keyboard: true } });
        const caption = `Великая война, затронувшая все 4 королевства мира Чёрного клевера, закончилась 300 лет назад.\n\nВойска Люциуса Зогратиса тогда потерпели поражение в битве за столицу Королевства Клевер. Жизнь возвратилась в мирное русло, а о героях той войны, Асте и Юно, стали слагать легенды.\nОднако на горизонте появилась новая угроза.\n\nИз дальних уголков всех четырёх королевств доходят слухи о странных подземельях, оставленных далёкими предками, жившими тысячилетия назад на этой земле, о разломах, порождающих невиданных чудовищ, а также о появленнии новых Великих Магических Зон на нейтральных территориях, в которых очень опасно находиться.\n\nCейчас после той великой войны судьба дала жителям мира Чёрного клевера передышку, но надолго ли?\n\nСможете ли вы повлиять на исход будущих событий и встать в один ряд с сильными мира сего? Все в ваших руках…`;
        ctx.sendPhoto(
            {
                source: HELLO_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Начать путешествие',
                            CALLBACK_QUERY_ACTIONS.ACTION_TRAVEL
                        ),
                    ],
                ]),
            }
        );
    }

    @Action('ACTION_TRAVEL')
    @On('callback_query')
    public async callbackQuery(@Ctx() ctx: BotContext) {
        try {
            await ctx.scene.enter(
                ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID
            );
        } catch (e) {
            this.logger.log(
                LOGGER_EXCEPTION,
                `❌ Error in CallbackQuery function. error - ${e}`
            );
        }
    }
}
