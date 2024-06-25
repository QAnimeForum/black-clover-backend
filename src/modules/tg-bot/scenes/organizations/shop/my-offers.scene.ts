import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import {
    BACK_BUTTON,
    MY_OFFERS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import { MarketService } from 'src/modules/items/service/market.service';
import { EqupmentItemEntity } from 'src/modules/items/entity/equpment.item.entity';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';

@Scene(ENUM_SCENES_ID.MY_OFFERS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class MyOffersScene {
    constructor(
        @Inject(MarketService) private readonly marketService: MarketService,
        @Inject(EqupmentItemService)
        private readonly equpmentItemService: EqupmentItemService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption =
            'На рынке игроки могут торговать предметами с друг-другом, выберите интересующую вас опцию.';

        const offers = await this.marketService.checkUsersOffers(
            ctx.from.id.toString()
        );

        const names: string[] = [];
        for (const offer of offers) {
            names.push(
                (await this.equpmentItemService.getItem(offer.item_id)).name
            );
        }
        await ctx.replyWithHTML(
            'Предложения выставленные вами:\n' +
                offers
                    .map(
                        (offer, index) =>
                            '\n' +
                            (index + 1) +
                            '. <b>' +
                            names[index] +
                            '</b> Цена в 💰 <b>' +
                            offer.price +
                            '</b>'
                    )
                    .join('') +
                '\n\nЧтобы удалить, какое-либо из предложений введите его номер',
            Markup.inlineKeyboard([
                Markup.button.callback('Вернуться', 'back_to_market'),
            ])
        );

        if (ctx.chat.type == 'private') {
            ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [MY_OFFERS_BUTTON, BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            await ctx.sendPhoto(
                {
                    source: KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                MY_OFFERS_BUTTON,
                                ENUM_ACTION_NAMES.MY_OFFERS_ACTION
                            ),

                            Markup.button.callback(
                                BACK_BUTTON,
                                ENUM_ACTION_NAMES.BACK_TO_SHOPPING_DISTRICT_ACTION
                            ),
                        ],
                    ]),
                }
            );
        }
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
    }
}
