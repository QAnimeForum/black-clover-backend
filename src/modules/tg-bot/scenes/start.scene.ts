import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { BotContext } from '../interfaces/bot.context';
import { TelegrafExceptionFilter } from '../filters/tg-bot.filter';
import { Inject, UseFilters } from '@nestjs/common';

import { HELLO_IMAGE_PATH } from '../constants/images';
import { UserService } from '../../user/services/user.service';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ENUM_SCENES_ID } from '../constants/scenes.id.enum';
import { Logger } from 'winston';
import { START_TREVEL_BUTTON } from '../constants/button-names.constant';
import { SquadsService } from 'src/modules/squards/service/squads.service';
@Scene(ENUM_SCENES_ID.START_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class StartScene {
    constructor(
        private readonly userService: UserService,
        private readonly squadService: SquadsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') senderId) {
        ctx.session.devilsList = null;
        ctx.session.grimoireRequestId = null;
        ctx.session.devilId = null;
        ctx.session.adminSelectedArmedForcesId = null;
        ctx.session.armedForcesId = null;
        ctx.session.problemId = null;
        ctx.session.itemId = null;
        ctx.session.devilPaginateQuery = null;
        ctx.session.adminGrimoireId = null;
        ctx.session.adminSpellId = null;
        ctx.session.spellEdit = null;
        ctx.session.devilCreateSpellDto = null;
        ctx.session.editUnionSpellId = null;
        const chatType = ctx.message.chat.type;
        const isUserExist = await this.userService.exists(senderId);
        if (isUserExist) {
            ctx.session.user =
                await this.userService.findUserByTelegramId(senderId);
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
            return;
        }
        if (chatType == 'private') {
            const caption = `Великая война, затронувшая все 4 королевства мира Чёрного клевера, закончилась 300 лет назад.\n\nВойска Люциуса Зогратиса тогда потерпели поражение в битве за столицу Королевства Клевер. Жизнь возвратилась в мирное русло, а о героях той войны, Асте и Юно, стали слагать легенды.\nОднако на горизонте появилась новая угроза.\n\nИз дальних уголков всех четырёх королевств доходят слухи о странных подземельях, оставленных далёкими предками, жившими тысячилетия назад на этой земле, о разломах, порождающих невиданных чудовищ, а также о появленнии новых Великих Магических Зон на нейтральных территориях, в которых очень опасно находиться.\n\nCейчас после той великой войны судьба дала жителям мира Чёрного клевера передышку, но надолго ли?\n\nСможете ли вы повлиять на исход будущих событий и встать в один ряд с сильными мира сего? Все в ваших руках…`;
            await ctx.sendPhoto(
                {
                    source: HELLO_IMAGE_PATH,
                },
                {
                    caption,
                    ...Markup.keyboard([START_TREVEL_BUTTON]).resize(),
                }
            );
        } else {
            await ctx.reply(
                'Мир Чёрного клевера вас не знает. Пожалуйста, перейдите в личные сообщения с ботом, для заполнения личной информации о себе.',
                {
                    ...Markup.inlineKeyboard([
                        Markup.button.url(
                            'Ссылка на бот',
                            'https://t.me/black_clover_role_play_bot'
                        ),
                    ]),
                }
            );
        }
    }

    @Hears(START_TREVEL_BUTTON)
    public async callbackQuery(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID);
    }
}
