import { BotContext } from '../../interfaces/bot.context';
import { CharacterService } from '../../../character/services/character.service';

import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    Action,
    Context,
    Ctx,
    Hears,
    InjectBot,
    Message,
    On,
    SceneEnter,
    Sender,
    TELEGRAF_STAGE,
    Wizard,
    WizardStep,
} from 'nestjs-telegraf';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { Logger } from 'winston';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { MapService } from 'src/modules/map/service/map.service';
import { RaceService } from 'src/modules/race/race.service';
import { WORLD_MAP_IMAGE_PATH } from '../../constants/images';
import { message } from 'telegraf/filters';
import { LOGGER_INFO } from '../../utils/logger';
import { GO_TO_HOME } from '../../constants/button-names.constant';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';

//@Wizard(ENUM_SCENES_ID.createCharacter)
//@UseFilters(TelegrafExceptionFilter)

//@Wizard(ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID)
//@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class CharacterCreateWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        private readonly raceService: RaceService,
        private readonly mapService: MapService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.CREATE_CHARACTER_FORM_SCENE_ID,
            this.start(),
            this.step1(),
            this.step2(),
            this.step3(),
            this.step4(),
            this.step5(),
            this.step6()
        );

        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            ctx.scene.session.character = {
                name: 'не заполнено',
                age: 15,
                sex: 'м',
                stateName: 'королевство Клевер',
                raceName: 'человек',
                magic: 'не заполнено',
            };
            await ctx.reply(
                'Привет, путешественник!\nЗаполните краткую информацию о себе',
                Markup.removeKeyboard()
            );
            await ctx.reply('Пора представиться! Введите своё имя.');
            ctx.wizard.next();
        });
        return composer;
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            const regex = /^[a-zA-ZА-Яа-я\-]{2,25}$/;
            const message = ctx.update?.message.text;
            if (regex.test(message)) {
                ctx.scene.session.character.name = message;
                await ctx.reply('Введите возраст. (Больше 15)');
                ctx.wizard.next();
            } else {
                await ctx.reply(
                    'Введите имя состоящее из русских или английских букв (от 2-х до 25 букв)'
                );
                ctx.wizard.back();
                ctx.wizard.selectStep(1);
            }
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            if (message.length < 1 || Number.isInteger(message)) {
                ctx.reply('возраст введён некорректно');
                ctx.wizard.back();
            }
            const age = Number(message);
            if (age < 15) {
                ctx.reply('вам должно быть больше 15');
                ctx.wizard.back();
            }
            ctx.scene.session.character.age = age;
            ctx.reply('Выберите пол персонажа', {
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
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            await ctx.answerCbQuery();
            ctx.scene.session.character.sex = ctx.update.callback_query['data'];
            const paginatedRaces = await this.raceService.findAll({
                path: '',
            });
            const buttons = paginatedRaces.data.map((item) => [
                { text: item.name, callback_data: `${item.id}:${item.name}` },
            ]);
            let description = '';
            paginatedRaces.data.map((race) => {
                description += `<strong><u>${race.name}</u></strong>\n<u>Характеристики</u>\nБонусы к hp:${race.bonusHp}\nБонусы к маг. силе:${race.bonusMagicPower}\n Использование природной маны: ${race.naturalMana ? 'да' : 'нет'}\n\n`;
            });
            /**
             *  ${race.description}\n  <u>Характеристики</u>\nБонусы к hp:${race.bonusHp}\nБонусы к маг. силе:${race.bonusMagicPower}\n${race.naturalMana}\n
             */
            console.log(description);
            await ctx.sendPhoto(
                {
                    source: WORLD_MAP_IMAGE_PATH,
                },
                {
                    caption: `Тебе предстоит выбрать одну из рас из списка ниже, облик которой ты примешь на просторах Чёрного клевера!\n ${description}`,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: buttons,
                    },
                }
            );
            ctx.wizard.next();
        });
        return composer;
    }

    step4() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            await ctx.answerCbQuery();
            console.log(ctx.update.callback_query['data']);
            const data = ctx.update.callback_query['data'].split(':');
            ctx.scene.session.character.raceId = data[0];
            ctx.scene.session.character.raceName = data[1];
            const paginateStates = await this.mapService.findAllStates({
                path: '',
            });
            const buttons = paginateStates.data.map((item) => [
                {
                    text: item.fullName,
                    callback_data: `${item.id}:${item.name}`,
                },
            ]);
            let caption = 'Выбери страну, в которой ты родился, путник! \n';
            paginateStates.data.map((state) => (caption += `${state.name}`));
            await ctx.sendPhoto(
                {
                    source: WORLD_MAP_IMAGE_PATH,
                },
                {
                    caption: caption,
                    reply_markup: {
                        inline_keyboard: buttons,
                    },
                }
            );
            ctx.wizard.next();
        });
        return composer;
    }
    step5() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            await ctx.scene.leave();
        });
        composer.on('callback_query', async (ctx) => {
            //    await ctx.answerCbQuery();
            const data = ctx.update.callback_query['data'].split(':');
            ctx.scene.session.character.stateId = data[0];
            ctx.scene.session.character.stateName = data[1];

            const user = await this.userService.createUser({
                tgUserId: ctx.update.callback_query.from.id.toString(),
                character: {
                    name: ctx.scene.session.character.name,
                    age: ctx.scene.session.character.age,
                    sex: ctx.scene.session.character.sex,
                    raceId: ctx.scene.session.character.raceId,
                    stateId: ctx.scene.session.character.stateId,
                },
                role: ENUM_ROLE_TYPE.USER,
            });
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно создал персонажа. * { name: ${ctx.update.callback_query.from.first_name} id: ${ctx.update.callback_query.from.id}}`
            );
            const title = `<strong><u>Ваш базовый профиль</u></strong>\n`;
            const nameLine = `<strong>Имя</strong>: ${ctx.scene.session.character.name}\n`;
            const ageLine = `<strong>Возраст</strong>: ${ctx.scene.session.character.age}\n`;
            const sexLine = `<strong>Пол</strong>: ${ctx.scene.session.character.sex}\n`;
            const stateLine = `<strong>Страна рождения</strong>: ${ctx.scene.session.character.stateName}\n`;
            const raceLine = `<strong>Раса</strong>: ${ctx.scene.session.character.raceName}\n`;
            const content = `${title}\n${nameLine}${ageLine}${sexLine}${stateLine}${raceLine}\n`;
            await ctx.reply(content, {
                parse_mode: 'HTML',
            });
            const afterCreateMessage =
                'Поздравляем, вы заполнили базувую информацию о себе. Но у вас всё ещё нет магического атрибута и гримуара. Для большинства активностей требуется гримуар. \n\nДля того, чтобы получить гиримуар, перейдите в главном меню во вкладку: `📕 Гримуар`.';
            await ctx.reply(afterCreateMessage, {
                ...Markup.keyboard([[GO_TO_HOME]]).resize(),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step6() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.hears(GO_TO_HOME, async (ctx) => {
            await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
        });

        return composer;
    }
}
