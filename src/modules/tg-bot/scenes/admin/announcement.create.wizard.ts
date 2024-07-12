import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { BackgroundService } from 'src/modules/character/services/background.service';
import { ENUM_ANNOUNCEMENT_TYPE } from 'src/modules/events/constant/announcement.enum';
import { AnnouncementService } from 'src/modules/events/services/announcement.service';
import { EDIT_HISTORY_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_INFO } from 'src/modules/tg-bot/utils/logger';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Logger } from 'winston';

@Injectable()
export class AnnouncementCreateWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly announcementService: AnnouncementService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.ANNOUNCEMENT_CREATE_SCENE_ID,
            this.start(),
            this.step1(),
            this.step2(),
            this.step3()
        );

        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));

        composer.command('cancel', async (ctx) => {
            await ctx.reply('Объявление не создано.');
            await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });
        composer.action('ADD_NEW_ANNOUNCEMENT', async (ctx) => {
            ctx.scene.session.announcement = {
                name: '',
                description: '',
            };

            ctx.reply('Введите название объявления.');
            ctx.wizard.next();
        });
        return composer;
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('История персонажа не изменена.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            ctx.scene.session.announcement.name = message;
            ctx.reply('Введите описание объявления.');
            ctx.wizard.next();
        });
        return composer;
    }

    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('История персонажа не изменена.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const message = ctx.update?.message.text;
            ctx.scene.session.announcement.description = message;

            const name = ctx.scene.session.announcement.name;
            const description = message;
            const caption = `<strong>Название:</strong> ${name}\n<strong>Описание</strong>\n${description}`;
            await ctx.reply(caption, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Сохранить как черновик',
                            `SAVE_AS_DRAFT`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Опубликовать объявления',
                            `POST_ANNOUMNCEMENT`
                        ),
                    ],
                    [Markup.button.callback('Отменить создание', `CANCEL`)],
                ]),
            });
            ctx.wizard.next();
        });
        return composer;
    }

    step3() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('История персонажа не изменена.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });

        composer.action('SAVE_AS_DRAFT', async (ctx) => {
            this.announcementService.createAnnouncement({
                title: ctx.scene.session.announcement.description,
                description: ctx.scene.session.announcement.description,
                type: ENUM_ANNOUNCEMENT_TYPE.DRAFT,
            });
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно создал персонажа. * { name: ${ctx.update.callback_query.from.first_name} id: ${ctx.update.callback_query.from.id}}`
            );
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });

        composer.action('POST_ANNOUMNCEMENT', async (ctx) => {
            this.announcementService.createAnnouncement({
                title: ctx.scene.session.announcement.description,
                description: ctx.scene.session.announcement.description,
                type: ENUM_ANNOUNCEMENT_TYPE.PUBLISHED,
            });
            this.logger.log(
                LOGGER_INFO,
                `🟢 Пользователь успешно создал персонажа. * { name: ${ctx.update.callback_query.from.first_name} id: ${ctx.update.callback_query.from.id}}`
            );
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });

        composer.action('CANCEL', async (ctx) => {
            ctx.reply('Создание объявления отменено');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
        });
        return composer;
    }
}
