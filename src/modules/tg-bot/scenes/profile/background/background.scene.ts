import { Inject, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Action, Context, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import {
    ADD_QUOTES_BUTTON,
    ALCOHOL_BUTTON,
    ARMOR_BUTTON,
    BACK_BUTTON,
    BACKGROUND_BUTTON,
    EDIT_APPEARANCE_BUTTON,
    EDIT_ATTACHMENTS_BUTTON,
    EDIT_AVATAR_BUTTON,
    EDIT_CHRACTER_TRAITS_BUTTON,
    EDIT_GOALS_BUTTON,
    EDIT_HISTORY_BUTTON,
    EDIT_HOBBIES_BUTTON,
    EDIT_IDEALS_BUTTON,
    EDIT_NAME_BUTTON,
    EDIT_QUOTE_BUTTON,
    EDIT_WEAKNESS_BUTTON,
    EDIT_WORLDVIEW_BUTTON,
    FOOD_BUTTON,
    GEARS_BUTTON,
    GRIMOIRE_BUTTON,
    INVENTORY_BUTTON,
    JEWEIRY_BUTTON,
    MINERALS_BUTTON,
    MY_DEVILS_BUTTON,
    MY_SPIRITS_BUTTON,
    PARAMS_BUTTON,
    PROFILE_BUTTON,
    REMOVE_QUOTES_BUTTON,
    TOOLKIT_BUTTON,
    VEHICLES_BUTTON,
    WALLET_BUTTON,
    WEAPONS_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { INVENTORY_IMAGE_PATH, KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { Markup } from 'telegraf';
import { Logger } from 'winston';
@Scene(ENUM_SCENES_ID.BACKGROUND_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class BackgroundScene {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Context() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const name = `<strong>Имя</strong>: ${background.name}\n`;
        const sex = `<strong>Пол</strong>: ${background.sex}\n`;
        const age = `<strong>Возраст</strong>: ${background.age}\n`;
        const history = `<strong>Предыстория пероснажа</strong>\n${background.history}\n`;
        const hobbies = `<strong>Хобби</strong>\n${background.hobbies}\n`;
        const goals = `<strong>Цели</strong>\n${background.goals}\n`;
        const worldview = `<strong>Мировоззрение персонажа</strong>: ${background.worldview}\n`;
        const characterTraits = `<strong>Черты характера</strong>: ${background.characterTraits}\n`;
        const ideals = `<strong>Идеалы</strong>\n${background.ideals}\n`;
        const attachments = `<strong>Привязанности</strong>\n${background.attachments}\n`;
        const weaknesses = `<strong>Слабости</strong>: ${background.weaknesses}\n`;
        const appearance = `<strong>Описание внешности</strong>\n${background.appearance}\n`;

        const race = `<strong>Раса</strong>: ${background.race.name}\n`;
        const state = `<strong>Страна происхождения</strong>: ${background.state.name}\n`;
        let quotes = `<strong>Цитаты</strong>\n`;
        background.quotes.map((quote, index) => {
            quotes += `${index}) ${quote}\n`;
        });
        const owner = `<strong>Владелец</strong>: @${username}\n`;
        const userId = `<strong>id</strong>: <code>${senderId}</code>\n\n`;
        const caption = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${name}${sex}${age}${state}${race}${appearance}`;
        const caption1 = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${characterTraits}${worldview}${hobbies}${ideals}`;
        const caption2 = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${goals}${weaknesses}${attachments}${quotes}`;
        await ctx.sendPhoto(
            {
                source: KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.keyboard([
                    [GRIMOIRE_BUTTON, BACKGROUND_BUTTON, PARAMS_BUTTON],
                    [WALLET_BUTTON, INVENTORY_BUTTON],
                    [MY_DEVILS_BUTTON, MY_SPIRITS_BUTTON],
                    [PROFILE_BUTTON, BACK_BUTTON],
                ]).resize(),
                /**    ...Markup.keyboard([[EDIT_BUTTON], [BACK_BUTTON]]).resize(), */
            }
        );

        await ctx.reply(caption1, {
            parse_mode: 'HTML',
        });
        await ctx.reply(caption2, {
            parse_mode: 'HTML',
        });
        await ctx.reply(history, {
            parse_mode: 'HTML',
        });
        await ctx.reply('меню редактирования информации персонажа', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(EDIT_NAME_BUTTON, EDIT_NAME_BUTTON),
                    Markup.button.callback(
                        EDIT_AVATAR_BUTTON,
                        EDIT_AVATAR_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_HISTORY_BUTTON,
                        EDIT_HISTORY_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_APPEARANCE_BUTTON,
                        EDIT_APPEARANCE_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_GOALS_BUTTON,
                        EDIT_GOALS_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_WORLDVIEW_BUTTON,
                        EDIT_WORLDVIEW_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_CHRACTER_TRAITS_BUTTON,
                        EDIT_CHRACTER_TRAITS_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_IDEALS_BUTTON,
                        EDIT_IDEALS_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_ATTACHMENTS_BUTTON,
                        EDIT_ATTACHMENTS_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_WEAKNESS_BUTTON,
                        EDIT_WEAKNESS_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        EDIT_WORLDVIEW_BUTTON,
                        EDIT_WORLDVIEW_BUTTON
                    ),
                    Markup.button.callback(
                        EDIT_HOBBIES_BUTTON,
                        EDIT_HOBBIES_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        ADD_QUOTES_BUTTON,
                        ADD_QUOTES_BUTTON
                    ),
                    Markup.button.callback(
                        REMOVE_QUOTES_BUTTON,
                        REMOVE_QUOTES_BUTTON
                    ),
                ],
                [Markup.button.callback(EDIT_QUOTE_BUTTON, EDIT_QUOTE_BUTTON)],
            ]),
        });
    }

    @Action(EDIT_NAME_BUTTON)
    async editName(@Context() ctx: BotContext) {
        console.log('hello');
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_NAME_SCENE_ID);
    }

    @Action(EDIT_HISTORY_BUTTON)
    async editHistory(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_CHARACTER_HISTORY_SCENE_ID);
    }

    @Action(EDIT_HOBBIES_BUTTON)
    async editAvatar(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_HOBBIES_SCENE_ID);
    }

    @Action(EDIT_GOALS_BUTTON)
    async editGoals(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_GOALS_SCENE_ID);
    }

    @Action(EDIT_WORLDVIEW_BUTTON)
    async editWorldview(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_WORLDVIEW_SCENE_ID);
    }

    @Action(EDIT_WEAKNESS_BUTTON)
    async editWeakness(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_WEAKNESS_SCENE_ID);
    }

    @Action(ADD_QUOTES_BUTTON)
    async addQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        //   await ctx.scene.enter(ENUM_SCENES_ID.ADD_QUOTES_SCENE_ID);
    }

    @Action(REMOVE_QUOTES_BUTTON)
    async removeQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        //    await ctx.scene.enter(ENUM_SCENES_ID.REMOVE_QUOTES_SCENE_ID);
    }

    @Action(EDIT_QUOTE_BUTTON)
    async editQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        // await ctx.scene.enter(ENUM_SCENES_ID.EDIT_QUOTE_SCENE_ID);
    }

    @Action(EDIT_CHRACTER_TRAITS_BUTTON)
    async editTraits(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_CHRACTER_TRAITS_SCENE_ID);
    }

    @Action(EDIT_IDEALS_BUTTON)
    async editIdeals(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_IDEALS_SCENE_ID);
    }
    @Action(EDIT_APPEARANCE_BUTTON)
    async editAppearance(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_APPEARANCE_SCENE_ID);
    }

    @Hears(BACKGROUND_BUTTON)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.BACKGROUND_SCENE_ID);
    }
    @Hears(PARAMS_BUTTON)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CHARACTER_PARAMETERS_SCENE_ID);
    }
    @Hears(WALLET_BUTTON)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.WALLET_SCENE_ID);
    }
    @Hears(INVENTORY_BUTTON)
    async inventory(@Ctx() ctx: BotContext, @Sender() sender) {
        const title = '<strong><u>Инвентарь</u></strong>\n\n';
        const owner = `<strong>Владелец</strong>: @${sender.username}\n\n`;
        const equipmentTitle = '<strong><u>Надетая экипировка</u></strong>\n\n';
        const weaponBlock = `${WEAPONS_BUTTON}:-\n`;
        const armorBlock = `${ARMOR_BUTTON}: -\n`;
        const jeweiryBlock = `${JEWEIRY_BUTTON}: -\n`;
        const foodBlock = `${FOOD_BUTTON}: -\n`;
        const alcoholBlock = `${ALCOHOL_BUTTON}: -\n`;
        const toolKitBlock = `${TOOLKIT_BUTTON}: -\n`;
        const gearsBlock = `${GEARS_BUTTON}: -\n`;
        const vehiclesBlock = `${VEHICLES_BUTTON}: -\n`;

        const resourcesTitle = `strong><u>♻️ Ресурсы</u></strong>\n\n`;
        const caption = `${title}${owner}${equipmentTitle}${weaponBlock}${armorBlock}${gearsBlock}${vehiclesBlock}${toolKitBlock}`;
        await ctx.sendPhoto(
            {
                source: INVENTORY_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            MINERALS_BUTTON,
                            MINERALS_BUTTON
                        ),
                        Markup.button.callback(JEWEIRY_BUTTON, JEWEIRY_BUTTON),
                    ],
                    [
                        Markup.button.callback(ALCOHOL_BUTTON, ALCOHOL_BUTTON),
                        Markup.button.callback(FOOD_BUTTON, FOOD_BUTTON),
                    ],

                    [
                        Markup.button.callback(WEAPONS_BUTTON, WEAPONS_BUTTON),
                        Markup.button.callback(ARMOR_BUTTON, ARMOR_BUTTON),
                    ],
                    [
                        Markup.button.callback(GEARS_BUTTON, GEARS_BUTTON),
                        Markup.button.callback(
                            VEHICLES_BUTTON,
                            VEHICLES_BUTTON
                        ),
                    ],
                ]),
            }
        );
    }
    @Hears(MY_DEVILS_BUTTON)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_DEVILS_SCENE_ID);
    }

    @Hears(MY_SPIRITS_BUTTON)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.MY_SPIRITS_SCENE_ID);
    }

    @Action(BACK_BUTTON)
    async profile(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}