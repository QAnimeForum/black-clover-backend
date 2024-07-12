import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
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
    CREATE_GARDEN_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { PlantService } from 'src/modules/plants/services/plant.service';
import { GardenEntity } from 'src/modules/plants/entity/garden.entity';

@Scene(ENUM_SCENES_ID.FIELDS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class FieldsScene {
    constructor(
        private readonly plantService: PlantService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId: string) {
        const garden = await this.plantService.findGardenByUserTgId(
            tgId.toString()
        );
        if (garden === null) {
            const caption = 'У вас не сада';
            if (ctx.chat.type == 'private') {
                await ctx.sendPhoto(
                    {
                        source: KNIGHT_IMAGE_PATH,
                    },
                    {
                        caption,
                        parse_mode: 'HTML',
                        ...Markup.keyboard([
                            [CREATE_GARDEN_BUTTON],
                            [BACK_BUTTON],
                        ]).resize(),
                    }
                );
                return;
            } else {
                await ctx.sendPhoto(
                    {
                        source: KNIGHT_IMAGE_PATH,
                    },
                    {
                        caption,
                        parse_mode: 'HTML'
                    }
                );
                return;
            }
        }

        this.showGarden(ctx, garden);
    }

    @Action('DISPLAY_GARDEN')
    async dispayGarden(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const garden = await this.plantService.findGardenByUserTgId(tgId);
        this.showGarden(ctx, garden);
    }
    @Hears(CREATE_GARDEN_BUTTON)
    async createGarden(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        const garden = await this.plantService.createGarden(tgId);
        this.showGarden(ctx, garden);
    }

    @Action(/^(pot.*)$/)
    async pot(@Ctx() ctx: BotContext, @Sender('id') tgId) {
        ctx.answerCbQuery();
        const potName = ctx.callbackQuery['data'];
        console.log(potName);
        const garden = await this.plantService.findGardenByUserTgId(tgId);
        const potId: number = garden[potName];
        const pot = await this.plantService.findPotById(potId.toString());
        const keyboard = [];
        let text = `Горшок ${potName}\n`;
        if (!pot?.plant) {
            text += '\nПока тут ничего не растет...';
            keyboard.push(
                Markup.button.callback(
                    'Посадить',
                    `planting_${potName.split('_')[1]}`
                )
            );
        }
        keyboard.push(Markup.button.callback(BACK_BUTTON, 'DISPLAY_GARDEN'));
        ctx.editMessageCaption(text, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboard),
        });
    }

    @Action(/^(planting.*)$/)
    async planting(@Ctx() ctx: BotContext) {
        ctx.answerCbQuery();
        const potNumber = ctx.callbackQuery['data'].split('_')[1];
        const plants = await this.plantService.findAllPlants();
        const buttons = plants.map((plant) =>
            Markup.button.callback(
                `${plant.emojiIcon} ${plant.name}`,
                `select_plant_${potNumber}_${plant.id}`
            )
        );
        buttons.push(Markup.button.callback(BACK_BUTTON, `pot_${potNumber}`));
        ctx.editMessageCaption(
            'Выберите растение для посадки:',
            Markup.inlineKeyboard(buttons)
        );
    }

    //@Action(/^select_plant_(\d+)_(\d+)$/)
    @Action(/^(select_plant_.*)$/)
    async selectPlant(ctx: BotContext) {
        const data = ctx.callbackQuery['data'].split('_');
        const potNumber = parseInt(data[2]);
        const plantId = data[3];
        console.log(data);

        const plant = await this.plantService.getPlantById(plantId);

        if (plant) {
            const priceInfo = '';
            /**
            *  if (plant.costMoney >= 0) {
                priceInfo += `Цена: ${plant.costMoney}💵`;
            }

            const text = `Растение: ${plant.emojiIcon} ${plant.name}\nОписание: ${plant.description}\n${priceInfo}\nМаксимальная стоимость при продаже: ${plant.salePrice} 💵\nИнтервал полива: каждые ${plant.wateringInterval} мин\nВремя засыхания: ${plant.deathTime} мин`;
            ctx.editMessageCaption(
                text,
                Markup.inlineKeyboard(
                    [
                        ...(plant.costMoney > 0
                            ? [
                                  Markup.button.callback(
                                      'Купить за деньги💵',
                                      `buy_plant_for_money_${potNumber}_${plantId}`
                                  ),
                              ]
                            : []),
                        Markup.button.callback(
                            'Назад',
                            `planting_${potNumber}`
                        ),
                    ].filter((button) => button !== undefined)
                )
            );
            */
        } else {
            ctx.reply('Извините, растение не найдено.');
        }
    }
    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ORGANIZATIONS_SCENE_ID);
    }

    async showGarden(ctx: BotContext, garden: GardenEntity) {
        const texts: Array<string> = [];
        console.log(garden);
        texts.push(
            `Горшок 1 ${garden?.pot_1?.plant?.emojiIcon ? `(${garden?.pot_1.plant.emojiIcon})` : ''}` ||
                `Горшок 1}`
        );
        texts.push(
            `Горшок 2 ${garden?.pot_1?.plant?.emojiIcon ? `(${garden?.pot_2.plant.emojiIcon})` : ''}` ||
                `Горшок 2}`
        );
        texts.push(
            `Горшок 3 ${garden?.pot_1?.plant?.emojiIcon ? `(${garden?.pot_3.plant.emojiIcon})` : ''}` ||
                `Горшок 3}`
        );
        texts.push(
            `Горшок 4 ${garden?.pot_1?.plant?.emojiIcon ? `(${garden?.pot_4.plant.emojiIcon})` : ''}` ||
                `Горшок 4}`
        );
        texts.push(
            `Горшок 5 ${garden?.pot_1?.plant?.emojiIcon ? `(${garden?.pot_5.plant.emojiIcon})` : ''}` ||
                `Горшок 5}`
        );
        await ctx.replyWithPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption:
                    '🏡Магический сад\n\nЗдесь можно вырастить волшебное растение и выручить за него ценные ресурсы и эффекты.',
                reply_markup: {
                    inline_keyboard: [
                        [
                            Markup.button.callback(texts[0], 'pot_1'),
                            Markup.button.callback(texts[1], 'pot_2'),
                        ],
                        [
                            Markup.button.callback(texts[2], 'pot_3'),
                            Markup.button.callback(texts[3], 'pot_4'),
                        ],
                        [Markup.button.callback(texts[4], 'pot_5')],
                        [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)],
                    ],
                },
                parse_mode: 'HTML',
            }
        );
    }
}
