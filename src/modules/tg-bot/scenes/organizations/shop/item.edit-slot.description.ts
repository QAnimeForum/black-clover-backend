import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectBot, TELEGRAF_STAGE } from 'nestjs-telegraf';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { ENUM_BODY_PART_ENUM } from 'src/modules/items/constants/body.part.enum';
import { ENUM_ITEM_RARITY } from 'src/modules/items/constants/item.entity.enum';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Composer, Markup, Scenes, Telegraf } from 'telegraf';
import { Logger } from 'winston';

@Injectable()
export class ItemEditSlotDescriptionWizard {
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
            ENUM_SCENES_ID.EDIT_SLOT_ITEM_SCENE_ID,
            this.step1()
        );
        this.scene.enter(this.start());
        this.stage.register(this.scene);
        bot.use(stage.middleware());
    }
    start() {
        return async (ctx: BotContext) => {
            await ctx.reply(
                'Выберите название слота, в который надевается предметю',
                {
                  ...Markup.removeKeyboard(),
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                'Головной убор',
                                'ENUM_BODY_PART:' +
                                    ENUM_BODY_PART_ENUM.HEADDRESS
                            ),
                            Markup.button.callback(
                                'Броня',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.ARMOR
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Двуручный предмет',
                                'ENUM_BODY_PART:' +
                                    ENUM_BODY_PART_ENUM.TWO_HANDS
                            ),
                            Markup.button.callback(
                                'Одноручный предмет',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.HAND
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Аксессуар',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.ACCESSORY
                            ),
                            Markup.button.callback(
                                'Перчатки',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.GLOVES
                            ),
                        ],
                        [
                            Markup.button.callback(
                                'Плащ',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.CLOAK
                            ),
                            Markup.button.callback(
                                'Ботинки',
                                'ENUM_BODY_PART:' + ENUM_BODY_PART_ENUM.FEET
                            ),
                        ],
                    ]),
                }
            );
        };
    }
    step1() {
        const composer = new Composer<BotContext>();
        composer.start((ctx) => ctx.scene.enter(ENUM_SCENES_ID.START_SCENE_ID));
        composer.command('cancel', async (ctx) => {
            await ctx.reply('Имя не изменено.');
            ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        composer.action(/^(ENUM_BODY_PART.*)$/, async (ctx) => {
            try {
                const bodyPart = ctx.callbackQuery['data'].split(':')[1];
                const itemId = ctx.session.itemId;
                await this.equipmentItemService.changeBodyPart({
                    id: itemId,
                    bodyPart: bodyPart,
                });
            } catch (err) {
                console.log(err);
            }
            await ctx.scene.enter(ENUM_SCENES_ID.SHOP_SCENE_ID);
        });
        return composer;
    }
}
