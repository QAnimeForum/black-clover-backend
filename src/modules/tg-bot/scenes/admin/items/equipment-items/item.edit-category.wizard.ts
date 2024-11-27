import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { BACK_BUTTON } from 'src/modules/tg-bot/constants/button-names.constant';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import composer from 'telegraf/typings/composer';
import { Logger } from 'winston';

@Injectable()
export class ItemEditCategoryWizard {
    readonly scene: Scenes.WizardScene<BotContext>;
    readonly steps: Composer<BotContext>[] = [];
    constructor(
        @InjectBot() bot: Telegraf<BotContext>,
        @Inject(TELEGRAF_STAGE)
        private readonly stage: Scenes.Stage<BotContext>,
        private readonly equipmentItemService: EqupmentItemService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
        this.scene = new Scenes.WizardScene<BotContext>(
            ENUM_SCENES_ID.EDIT_CATEGORY_ITEM_SCENE_ID,
            this.step1(),
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            const categories = await this.equipmentItemService.findCategories();
            const buttons = [];
            for (let i = 0; i < categories.length; ++i) {
                buttons.push([
                    Markup.button.callback(
                        categories[i].name,
                        `CATEGORY_ID:${categories[i].id}`
                    ),
                ]);
            }
            await ctx.reply('Выберите категорию товара', {
                ...Markup.inlineKeyboard(buttons),
            });
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
        });

        composer.action(/^(CATEGORY_ID.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const categoryId = ctx.callbackQuery['data'].split(':')[1];
            if (categoryId == 'null') {
                const categories =
                    await this.equipmentItemService.findCategories();
                const buttons = [];
                for (let i = 0; i < categories.length; ++i) {
                    buttons.push([
                        Markup.button.callback(
                            categories[i].name,
                            `CATEGORY_ID:${categories[i].id}`
                        ),
                    ]);
                }
                await ctx.deleteMessage();
                await ctx.replyWithHTML('Категории', {
                    ...Markup.inlineKeyboard(buttons),
                });
            } else {
                const categories =
                    await this.equipmentItemService.findCategoriesByRoot(
                        categoryId
                    );
                const children = categories.children;
                const buttons = [];
                if (children.length > 0) {
                    for (let i = 0; i < children.length; ++i) {
                        buttons.push([
                            Markup.button.callback(
                                children[i].name,
                                `CATEGORY_ID:${children[i].id}`
                            ),
                        ]);
                    }
                    buttons.push([
                        Markup.button.callback(
                            BACK_BUTTON,
                            `CATEGORY_ID:${categories.parentId}`
                        ),
                    ]);
                    await ctx.deleteMessage();
                    await ctx.replyWithHTML('Категории', {
                        ...Markup.inlineKeyboard(buttons),
                    });
                } else {
                    buttons.push([
                        Markup.button.callback('Да', `YES:${categories.id}`),
                    ]);
                    buttons.push([
                        Markup.button.callback('Нет', `NO:${categories.id}`),
                    ]);
                    await ctx.replyWithHTML(
                        `Вы хотите выбрать категорию ${categories.name}`,
                        {
                            ...Markup.inlineKeyboard(buttons),
                        }
                    );
                }
            }
        });
        composer.action(/^(YES.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            try {
                const categoryId = ctx.callbackQuery['data'].split(':')[1];
                const itemId = ctx.session.itemId;
                await this.equipmentItemService.changeItemCategory({
                    id: itemId,
                    categoryId: categoryId,
                });
            } catch (err) {
                console.log(err);
            }
            await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });

        composer.action(/^(NO.*)$/, async (ctx) => {
            await ctx.answerCbQuery();
            const categoryId = ctx.callbackQuery['data'].split(':')[1];
            if (categoryId == 'null') {
                const categories =
                    await this.equipmentItemService.findCategories();
                const buttons = [];
                for (let i = 0; i < categories.length; ++i) {
                    buttons.push([
                        Markup.button.callback(
                            categories[i].name,
                            `CATEGORY_ID:${categories[i].id}`
                        ),
                    ]);
                }
                await ctx.deleteMessage();
                await ctx.replyWithHTML('Категории', {
                    ...Markup.inlineKeyboard(buttons),
                });
            } else {
                const categories =
                    await this.equipmentItemService.findCategoriesByRoot(
                        categoryId
                    );
                const children = categories.children;
                const buttons = [];
                if (children.length > 0) {
                    for (let i = 0; i < children.length; ++i) {
                        buttons.push([
                            Markup.button.callback(
                                children[i].name,
                                `CATEGORY_ID:${children[i].id}`
                            ),
                        ]);
                    }
                    buttons.push([
                        Markup.button.callback(
                            BACK_BUTTON,
                            `CATEGORY_ID:${categories.parentId}`
                        ),
                    ]);
                    await ctx.deleteMessage();
                    await ctx.replyWithHTML('Категории', {
                        ...Markup.inlineKeyboard(buttons),
                    });
                }
            }
        });
        return composer;
    }
}
