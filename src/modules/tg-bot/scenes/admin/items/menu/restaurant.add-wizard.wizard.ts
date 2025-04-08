import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { Scenes, Composer, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { LOGGER_EXCEPTION } from 'src/modules/tg-bot/utils/logger';
import Downloader from 'nodejs-file-downloader';
import { Logger } from 'winston';
import { DrinkService } from 'src/modules/cuisine/service/drink.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MenuService } from 'src/modules/cuisine/service/menu.service';

@Injectable()
export class RestaurantAddWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly drinkService: DrinkService,
        private readonly menuService: MenuService
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.DRINK_ADD_TO_MENU_SCENE_ID,
            this.step1(),
            this.step2(),
            this.step3()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            ctx.scene.session.offerAmount = {
                itemId: '',
                copper: 0,
                silver: 0,
                electrum: 0,
                gold: 0,
                platinum: 0,
            };
            const query: PaginateQuery = {
                path: '',
                page: 1,
                limit: 10,
            };
            const drinks = await this.drinkService.findAllDrinks(query);
            const caption = 'Список напитков';
            const buttons = [];
            drinks.data.forEach((drink) => {
                buttons.push([
                    Markup.button.callback(
                        `${drink.name}`,
                        `DRINK:${drink.id}`
                    ),
                ]);
            });
            await ctx.reply(caption, { ...Markup.inlineKeyboard(buttons) });
            //    ctx.scene.session.offerAmount.itemId = ctx.session.itemId;
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Предложение в ресторане не создано.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        composer.action(/^(DRINK.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const drinkId = ctx.callbackQuery['data'].split(':')[1];
            ctx.scene.session.offerAmount.itemId = drinkId;
            await ctx.reply(
                `Введите сумму, которую находите начислить предмету, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.next();
        });

        return composer;
    }
    step2() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Предложение в ресторане не создано.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        composer.on(message('text'), async (ctx) => {
            const array = ctx.update.message.text.split(' ');
            if (array.length !== 5) {
                ctx.reply(
                    'Введено не 5 чисел. \nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const isAllItemsInteger = array.every((item) =>
                Number.isInteger(item)
            );
            if (isAllItemsInteger) {
                ctx.reply(
                    'Не все введённые символы являются цифры.\nДля выхода из меню ввода напишите /cancel.'
                );
                ctx.wizard.back();
                return;
            }
            const copperText = ` Медные: ${array[0]}\n`;
            const silverText = `Серебряные: ${array[1]}\n`;
            const electrumText = `Электрумовые: ${array[2]}\n`;
            const goldText = `Золотые: ${array[3]}\n`;
            const platinumText = `Платиновые: ${array[4]}\n`;
            ctx.scene.session.offerAmount.copper = Number.parseInt(array[0]);
            ctx.scene.session.offerAmount.silver = Number.parseInt(array[1]);
            ctx.scene.session.offerAmount.electrum = Number.parseInt(array[2]);
            ctx.scene.session.offerAmount.gold = Number.parseInt(array[3]);
            ctx.scene.session.offerAmount.platinum = Number.parseInt(array[4]);
            const caption =
                `Вы хотите назначить предмету сумму:\n` +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;

            await ctx.reply(caption, {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Да', 'yes')],
                    [Markup.button.callback('Изменить сумму', 'CHANGE_MONEY')],
                    //     [Markup.button.callback('Изменить id', 'CHANGE_ID')],
                    [
                        Markup.button.callback(
                            'Отменить добавление в магазин',
                            'CANCEL_ORDER'
                        ),
                    ],
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
            await ctx.reply('Предложение в ресторане не создано.');
            ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        composer.action('yes', async (ctx) => {
            await ctx.answerCbQuery();
            const restaurantMenuId = ctx.session.adminMenuId;
            const copperText = `Медные: ${ctx.scene.session.offerAmount.copper}\n`;
            const silverText = `Серебряные: ${ctx.scene.session.offerAmount.silver}\n`;
            const electrumText = `Электрумовые: ${ctx.scene.session.offerAmount.electrum} \n`;
            const goldText = `Золотые: ${ctx.scene.session.offerAmount.gold}\n`;
            const platinumText = `Платиновые: ${ctx.scene.session.offerAmount.platinum}\n`;

            const caption =
                '<strong>Товару назначена сумма</strong>:\n' +
                copperText +
                silverText +
                electrumText +
                goldText +
                platinumText;
            await ctx.reply(caption, {
                parse_mode: 'HTML',
            });
            const result = await this.menuService.creeateDrinkInMenu(
                restaurantMenuId,
                ctx.scene.session.offerAmount
            );
            ctx.scene.session.offerAmount = null;

            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });

        composer.action('CHANGE_MONEY', async (ctx) => {
            await ctx.reply(
                `Введите сумму, которую находите начислить, в формате:\n {количество медных} {количество серебряных} {количество золотых} {количество электрумовых} {количество платиновых}`
            );
            ctx.wizard.back();
            ctx.wizard.selectStep(1);
        });
        composer.action('CANCEL', async (ctx) => {
            await ctx.reply('Первод денег отменён.');
            await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
        });
        return composer;
    }
}
