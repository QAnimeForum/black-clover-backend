import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { BotContext } from '../../interfaces/bot.context';
import { TgBotService } from '../../services/tg-bot.service';
import { Inject, Injectable } from '@nestjs/common';
import { LanguageTexts } from '../../constants/language.text.constant';
import { CharacterService } from 'src/app/modules/character/services/character.service';
import { MapService } from 'src/app/modules/map/service/map.service';
import { RaceService } from 'src/app/modules/race/race.service';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { message } from 'telegraf/filters';
import { Telegraf, Scenes, Composer, Markup } from 'telegraf';
import { UserService } from 'src/app/modules/user/services/user.service';

//@Wizard(SceneIds.createCharacter)
//@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class CreateCharacterWizard {
    //   private readonly logger = new Logger(AddDiscountWizard.name)
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly characterService: CharacterService,
        private readonly mapService: MapService,
        private readonly raceService: RaceService,
        private readonly userService: UserService,
        private readonly tgBotService: TgBotService
    ) {
        // Create scene and add steps
        this.steps = [
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6(),
            this.step7(),
            this.step8(),
            /* this.step2(),
        this.step3(),
        this.step4(),
        this.step5(),
        this.step6()*/
        ];
        this.scene = new Scenes.WizardScene<BotContext>(
            SceneIds.createCharacter,
            ...this.steps
        );
        // Register add discount wizard
        this.stage.register(this.scene);
        bot.use(stage.middleware());
        bot.catch((err: Error, ctx) => {
            console.log(err);
            // this.tgBotService.catchException(err, ctx, this.logger)
        });
    }

    step1() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.reply(
                    ctx.i18n.t(LanguageTexts.character_create_entry)
                );
                await ctx.reply(
                    ctx.i18n.t(LanguageTexts.character_create_name)
                );
                ctx.wizard.next();
            });
        });
    }

    step2() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                if (msg.length < 1) {
                    ctx.reply(
                        'Пожалуйста, введите имя, состоящее хотя бы из одного символа.'
                    );
                    return;
                }
                ctx.scene.session.character = {
                    name: msg,
                    age: 0,
                    sex: '',
                    state: '',
                    race: '',
                };
                const dto: any = {
                    _search: undefined,
                    _limit: 20,
                    _offset: 0,
                    _order: { name: 'ASC' },
                    _availableOrderBy: ['name'],
                    _availableOrderDirection: [
                        ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                        ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                    ],
                };
                const [states] = await this.mapService.getAllStates(dto);
                console.log(states);
                const buttons = states.map((item) => [
                    { text: item.fullName, callback_data: item.id },
                ]);
                ctx.sendPhoto(
                    {
                        source: WORLD_MAP_IMAGE_PATH,
                    },
                    {
                        caption: ctx.i18n.t(
                            LanguageTexts.character_create_country
                        ),
                        reply_markup: {
                            inline_keyboard: buttons,
                        },
                    }
                );
                ctx.wizard.next();
            });
        });
    }

    step3() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.state = ctx.callbackQuery.data;
                } else ctx.scene.leave();
                const dto: any = {
                    _search: undefined,
                    _limit: 20,
                    _offset: 0,
                    _order: { name: 'ASC' },
                    _availableOrderBy: ['name'],
                    _availableOrderDirection: [
                        ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                        ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                    ],
                };
                const [races] = await this.raceService.findAllRaces(dto);
                const buttons = races.map((item) => [
                    { text: item.name, callback_data: item.id },
                ]);
                ctx.sendPhoto(
                    {
                        source: WORLD_MAP_IMAGE_PATH,
                    },
                    {
                        caption: ctx.i18n.t(
                            LanguageTexts.character_create_race
                        ),
                        reply_markup: {
                            inline_keyboard: buttons,
                        },
                    }
                );
                ctx.wizard.next();
            });
        });
    }

    step4() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.race = ctx.callbackQuery.data;
                } else ctx.scene.leave();

                ctx.reply(ctx.i18n.t(LanguageTexts.character_create_age));
                ctx.wizard.next();
            });
        });
    }

    step5() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.on(message('text'), async (ctx) => {
                const msg = ctx.update?.message.text;
                if (msg.length < 1) {
                    ctx.reply('возраст введён некорректно');
                    return;
                }
                ctx.scene.session.character.age = Number(msg);
                ctx.reply(ctx.i18n.t(LanguageTexts.character_create_sex), {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'м', callback_data: 'м' },
                                { text: 'ж', callback_data: 'ж' },
                            ],
                        ],
                    },
                });
                ctx.wizard.next();
            });
        });
    }
    // STEP - 6 Get location, save discount
    step6() {
        return this.tgBotService.createComposer((composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    ctx.scene.session.character.sex = ctx.callbackQuery.data;
                } else ctx.scene.leave();

                const race = await this.raceService.getRaceById(
                    ctx.scene.session.character.race
                );
                const state = await this.mapService.findStateById(
                    ctx.scene.session.character.state
                );
                const content = `${ctx.i18n.t(LanguageTexts.character_create_check_information)}
                ${ctx.i18n.t(LanguageTexts.character_profile_name)}${ctx.scene.session.character.name}
                ${ctx.i18n.t(LanguageTexts.character_profile_age)}${ctx.scene.session.character.age}
                ${ctx.i18n.t(LanguageTexts.character_profile_sex)}${ctx.scene.session.character.sex}
                ${ctx.i18n.t(LanguageTexts.character_profile_state)}${state.name}
                ${ctx.i18n.t(LanguageTexts.character_profile_race)}${race.name}
                `;
                ctx.reply(content, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'да', callback_data: '1' },
                                { text: 'да (пока)', callback_data: '1' },
                            ],
                        ],
                    },
                });
                await ctx.wizard.next();
            });
        });
    }
    step7() {
        return this.tgBotService.createComposer((composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                const character = (
                    await this.characterService.createPlayableCharacterDto({
                        name: ctx.scene.session.character.name,
                        sex: ctx.scene.session.character.sex,
                        age: ctx.scene.session.character.age,
                        raceId: ctx.scene.session.character.race,
                        countryId: ctx.scene.session.character.state,
                    })
                ).raw[0];
                const dto = {
                    tgUserId: String(ctx.from.id),
                    character: character,
                };
                this.userService.createUser(dto);
                ctx.reply(
                    ctx.i18n.t(LanguageTexts.character_congratulations),
                    Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                ctx.i18n.t(LanguageTexts.grimoire_think),
                                'EXIT'
                            ),
                        ],
                    ])
                );
                ctx.wizard.next();
                //   await ctx.scene.leave();
            });
        });
    }
    step8() {
        return this.tgBotService.createComposer(async (composer) => {
            composer.use(async (ctx) => {
                await ctx.answerCbQuery();
                if ('data' in ctx.callbackQuery) {
                    switch (ctx.callbackQuery.data) {
                        case 'EXIT': {
                            ctx.reply(
                                'вы можете увидеть, что есть',
                                Markup.keyboard([
                                    ['Профиль', 'Карта'],
                                    ['Дьяволы', 'Духи'],
                                ]).resize()
                            );
                            ctx.scene.leave();
                            break;
                        }
                    }
                } else ctx.scene.leave();

                //ctx.reply(ctx.i18n.t(LanguageTexts.character_create_age));
                await ctx.scene.leave();
            });
        });
    }
}

/**
 * 
    /**
     * 
     * @returns        reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Шаблон гримуара',
                                    url: SAMPLE_GRIMOURE_URL,
                                },
                                {
                                    text: 'Шаблон заклинания',
                                    url: SAMPLE_SPELL_URL,
                                },
                            ],
                            [
                                {
                                    text: 'Создать гримуар самому и отравить его на проверку админу',
                                    callback_data: 'create_a_grimoire_yourself',
                                },
                            ],
                            [
                                {
                                    text: 'Выбрать только магический атрибут ',
                                    callback_data: 'create_a_grimoire_yourself',
                                },
                            ],
                            [
                                {
                                    text: 'Админы сделают за вас всё',
                                    callback_data: 'admins_create_grimoure',
                                },
                            ],
                            [
                                {
                                    text: ctx.i18n.t(
                                        LanguageTexts.grimoire_think
                                    ),
                                    callback_data: 'admins_create_grimoure',
                                },
                            ],
                        ],
                    },
 */
/**
 * ctx.wizard.state.characterData.goal = ctx.message.text;
 * async(ctx) => {
    await ctx.answerCbQuery();
    ctx.wizard.state.characterData.sex =ctx.update.callback_query.data;;
    ctx.reply('Пожалуйста, введите характер персонажа:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.character = ctx.message.text;
    ctx.reply('Пожалуйста, введите увлечения:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.hobbies = ctx.message.text;
    ctx.reply('Пожалуйста, введите любимые цитаты, если есть:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.quotes = ctx.message.text;
    ctx.reply('Пожалуйста, введите введите биографию персонажа:');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.characterData.bio = ctx.message.text;
    ctx.reply('Пожалуйста, введите введите цель персонажа:');
    return ctx.wizard.next();
  },
 */

/**
 * Общие данные: 

Полных лет: 309
Рост: 6 фут. (183 см.)
Вес: 160 фунт. (72 кг.)
Кожа: алебастровая 
Глаза: сияющие золотом
Взгляд: злой
Прическа: аккуратная прическа с жгутами и косами
Цвет волос: пепельно-белые
Лицо: худое
Растительность на лице: отсутствует
Особенности: исполосованная спина, рассеченная бровь, один глаз не видит, рассеченная бровь

Размер:  
Скорость: 30
Языки: Общий, Эльфийский, Подземный

Предыстория персонажа:
Преступник 
Направленность - Карманник

Черта характера - Наилучший способ заставить меня сделать что-то ? сказать мне этого не делать.
Идеал - Милосердие. Я краду у богачей, чтобы помочь людям в беде.
Привязанность - Я виновен в ужасающем преступлении. Надеюсь, я смогу простить себя за это.
Слабость - Когда я становлюсь перед выбором между друзьями и деньгами, я обычно выбираю деньги.

Владение инструментами: Воровские инструменты, один игровой набор.

 
    КД: 4
    ХП: 0 из 0
    Вр ХП: 0 
    
    Статы:
    
    Сила: 10 (0)
    Ловкость: 10 (0)
    Телосложение: 10 (0)
    Интеллект: 10 (0)
    Мудрость: 10 (0)
    Харизма: 10 (0)
     
    Инициатива: 0
    Бонус мастерства: 0
    Скорость: 0 фт
    Пасс\. Внимательность: 0
    
    Спасброски:
    Мудрость и Харизма
    
    Навыки:
    Религия
    Запугивание
    Внимание
 */
