import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { Logger } from 'winston';

@Injectable()
export class ItemEditRarityWizard {
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
            ENUM_SCENES_ID.EDIT_RARITY_ITEM_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply('Выберите редкость товара', {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Обычные',
                            `RARITY:${ENUM_ITEM_RARITY.COMMON}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Необычные',
                            `RARITY:${ENUM_ITEM_RARITY.UNCOMMON}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Редкие',
                            `RARITY:${ENUM_ITEM_RARITY.RARE}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Эпичные',
                            `RARITY:${ENUM_ITEM_RARITY.EPIC}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Легендарые',
                            `RARITY:${ENUM_ITEM_RARITY.LEGENDARY}`
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Уникальные',
                            `RARITY:${ENUM_ITEM_RARITY.UNIQUE}`
                        ),
                    ],
                ]),
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
        composer.action(/^(RARITY.*)$/, async (ctx) => {
            try {
                const rarity = ctx.callbackQuery['data'].split(':')[1];
                const itemId = ctx.session.itemId;
                await this.equipmentItemService.changeItemRarity({
                    id: itemId,
                    rarity: rarity,
                });
            } catch (err) {
                console.log(err);
            }
            await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        return composer;
    }
}
