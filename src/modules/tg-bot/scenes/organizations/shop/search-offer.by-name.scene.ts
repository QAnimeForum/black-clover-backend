import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'typeorm';

import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { MarketEntity } from 'src/modules/items/entity/market.entity';
import { MarketService } from 'src/modules/items/service/market.service';

@Injectable()
export class SearchOfferByNameScene {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(CharacterService) private readonly characterService: CharacterService,
        @Inject(MarketService) private readonly marketService: MarketService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.SEARCH_OFFERS_BY_NAME_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите название предмета:');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            let offers: MarketEntity[] = [];
            if (offers.length === 0) {
                offers = await this.marketService.findOffersWithItem(
                    ctx.message.text
                );

                await ctx.replyWithHTML(
                    'Есть следующие предложения:\n' +
                        (await (async () => {
                            const result = [];
                            for (let i = 0; i < offers.length; ++i) {
                                result.push(
                                    '\n' +
                                        (i + 1) +
                                        '. Цена в 💰 <b>' +
                                        offers[i].price +
                                        '</b> Продавец: ' +
                                        (await this.characterService.findCharacterById(
                                            offers[i].owner_id
                                        ))
                                );
                            }
                            return result.join('');
                        })()) +
                        '\n\nВведите номер предложения, которое вы хотите купить, либо начните поиск заново',
                    Markup.inlineKeyboard([
                        Markup.button.callback('Искать снова', 'search'),
                        Markup.button.callback(
                            'Вернуться назад',
                            'back_to_market'
                        ),
                    ])
                );
            } else {
                const num = parseInt(ctx.message.text);
                ctx.telegram.editMessageReplyMarkup(
                    ctx.message.chat.id,
                    ctx.message.message_id,
                    undefined,
                    { inline_keyboard: [] }
                );

                if (offers.length > 0 && num <= offers.length && num > 0) {
                    if (
                        await this.marketService.buyOffer(
                            ctx.from.id.toString(),
                            offers[num - 1].id
                        )
                    ) {
                        ctx.reply(
                            'Предмет успешно куплен!',
                            Markup.inlineKeyboard([
                                Markup.button.callback(
                                    'Искать снова',
                                    'search'
                                ),
                                Markup.button.callback(
                                    'Вернуться назад',
                                    'back_to_market'
                                ),
                            ])
                        );
                    } else {
                        ctx.reply(
                            'Не удалось приобрести предмет, возможно на счету не хватает средств или предложение уже неактуально',
                            Markup.inlineKeyboard([
                                Markup.button.callback(
                                    'Искать снова',
                                    'search'
                                ),
                                Markup.button.callback(
                                    'Вернуться назад',
                                    'back_to_market'
                                ),
                            ])
                        );
                    }
                } else {
                    ctx.reply(
                        'Неверный номер предложения. Введите число заново:',
                        Markup.inlineKeyboard([
                            Markup.button.callback('Искать снова', 'search'),
                            Markup.button.callback(
                                'Вернуться назад',
                                'back_to_market'
                            ),
                        ])
                    );
                }

                offers = [];
            }
            ctx.scene.enter(ENUM_SCENES_ID.CHECK_OFFERS_SCENE_ID);
        });
        return composer;
    }
}

@Injectable()
export class SearchOfferByCategoryScene {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.SEARCH_OFFERS_BY_CATEGORY_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Введите название предмета:');
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Цели не изменены.');
            ctx.scene.enter(ENUM_SCENES_ID.BLACK_MARKET_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {});
        return composer;
    }
}
