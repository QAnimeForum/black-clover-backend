import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import {
    GRIMOURE_IMAGE_PATH,
    INVENTORY_IMAGE_PATH,
    KNIGHT_IMAGE_PATH,
} from '../../constants/images';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { GrimoireService } from '../../../grimoire/services/grimoire.service';
import {
    ALCOHOL_BUTTON,
    ARMOR_BUTTON,
    BACK_BUTTON,
    BACKGROUND_BUTTON,
    CREATE_SPELL_BUTTON,
    EDIT_GRIMOIRE_BUTTON,
    EDIT_MAGIC_COLOR_BUTTON,
    EDIT_MAGIC_NAME_BUTTON,
    EDIT_SPELL_BUTTON,
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
    TOOLKIT_BUTTON,
    VEHICLES_BUTTON,
    WALLET_BUTTON,
    WEAPONS_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { SpellEntity } from 'src/modules/grimoire/entity/spell.entity';

@Scene(ENUM_SCENES_ID.PROFILE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class ProfileScene {
    constructor(
        private readonly characterService: CharacterService,
        private readonly grimoireService: GrimoireService
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const username = sender.username;
        const character =
            await this.characterService.findFullCharacterInfoByTgId(senderId);
        const background = character.background;
        const name = `<strong>Имя</strong>: ${background.name}\n`;
        const sex = `<strong>Пол</strong>: ${background.sex}\n`;
        const age = `<strong>Возраст</strong>: ${background.age}\n`;
        const state = `<strong>Страна происхождения</strong>: ${background.state.name}\n`;
        const race = `<strong>Раса</strong>: ${background.race.name}\n`;
        const title = `<strong><u>ПРОФИЛЬ</u></strong>\n\n`;
        const owner = `<strong>Владелец</strong>: @${username}\n`;
        const userId = `<strong>Ваш id</strong>: <code>${senderId}</code>\n`;
        const magicTypeBlock = `<strong>Магический атрибут</strong>: ${character.grimoire.magicName}\т`;
        const delimiter = `_____________\n`;

        const characteristics = character.characterCharacteristics;
        const levelBlock = `<strong>Уровень персонажа</strong>: ${characteristics.currentLevel}/${characteristics.maxLevel}\n`;
        const hpBlock = `<strong>♥️</strong>: ${characteristics.currentHealth}/${characteristics.maxHealth}\n`;
        const magicPowerBlock = `<strong>Магичесая сила</strong>: 500/500\n`;
        const strengthBlock = `<strong>💪Сила</strong>: ${characteristics.strength.score}\n`;
        const dexterityBlock = `<strong>🏃Ловкость</strong>: ${characteristics.dexterity.score}\n`;
        const constitutionBlock = `<strong>🏋️Телосложение</strong>: ${characteristics.constitution.score}\n`;
        const intelligenceBlock = `<strong>🎓Интеллект</strong>: ${characteristics.intelligence.score}\n`;
        const wisdomBlock = `<strong>📚Мудрость</strong>: ${characteristics.wisdom.score}\n`;
        const charismaBlock = `<strong>🗣Харизма</strong>: ${characteristics.charisma.score}\n`;
        //   const armorClassBlock = `${characteristics.armorClass.}${characteristics.armorClassBlock.name}${characteristics.armorClassBlock.score}`;

        const characteristicsTitle = `\n<strong><u>Характеристики персонажа</u></strong>\n\n`;
        const characteristicsBlock = `${characteristicsTitle}${levelBlock}${hpBlock}${magicPowerBlock}${strengthBlock}${dexterityBlock}${constitutionBlock}${intelligenceBlock}${wisdomBlock}${charismaBlock}`;
        const caption = `${title}${owner}${userId}${name}${sex}${age}${state}${race}${magicTypeBlock}${characteristicsBlock}`;
        ctx.sendPhoto(
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
            }
        );
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
    @Hears(GRIMOIRE_BUTTON)
    async grimoire(@Ctx() ctx: BotContext, @Sender() sender) {
        const grimoire = await this.grimoireService.findGrimoireByUserTgId(
            sender.id
        );
     /**
      *    const [spellEntities] = await this.grimoireService.findAllSpells(
            {
                _search: undefined,
                _limit: 20,
                _offset: 0,
                _order: { name: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
                _availableOrderBy: ['name'],
                _availableOrderDirection: [
                    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
                    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
                ],
            },
            grimoire.id
        );
      */

        const spells: Array<SpellEntity> = [];
        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        let caption = `${title}${magicBlock}<strong>Обложка</strong>: ${grimoire.coverSymbol}\n`;
        //<strong>Цвет магии</strong>: ${grimoire.magicColor}
        const spellListMessages: Array<{
            id: string;
            text: string;
        }> = [];
        if (spells.length === 0) {
            caption = caption.concat(`У вас нет заклинаний`);
        } else {
            let spellListBlock = '';
            spellListBlock = spellListBlock.concat(
                `<strong>Список заклинаний</strong>\n`
            );
            spells.map((spell, index) => {
                spellListBlock = spellListBlock.concat(
                    `${index + 1}) ${spell.name}\n`
                );
                const title = `<strong><u>Заклинание ${index + 1}</u></strong>\n`;
                const nameBlock = `<strong>Название</strong>: ${spell.name}\n`;
                const costBlock = `<strong>Стоимость заклинания</strong>: ${spell.cost}\n`;
                const castTImeBlock = `<strong>Время каста заклинания</strong>: ${spell.castTime}\n`;
                const durationBlock = `<strong>Продолжительность заклинания</strong>: ${spell.duration}\n`;
                const rangeBlock = `<strong>Дальность заклинания</strong>: ${spell.range}\n`;
                const descriptionBlock = `<strong>Описание</strong>\n${spell.description}\n`;
                const spellMessage = `${title}${nameBlock}${costBlock}${castTImeBlock}${durationBlock}${rangeBlock}${descriptionBlock}\n\n`;
                spellListMessages.push({
                    id: spell.id,
                    text: spellMessage,
                });
            });
            caption = caption.concat(spellListBlock);
        }
        await ctx.sendPhoto(
            {
                source: GRIMOURE_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            CREATE_SPELL_BUTTON,
                            CREATE_SPELL_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            EDIT_MAGIC_NAME_BUTTON,
                            EDIT_MAGIC_NAME_BUTTON
                        ),
                    ],
                    [
                        Markup.button.callback(
                            EDIT_MAGIC_COLOR_BUTTON,
                            EDIT_MAGIC_COLOR_BUTTON
                        ),
                    ],
                ]),
            }
        );
        spellListMessages.map(
            async (spell) =>
                await ctx.reply(spell.text, {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.callback(
                                EDIT_SPELL_BUTTON,
                                `EDIT_SPELL:${spell.id}`
                            ),
                        ],
                    ]),
                })
        );
        //await ctx.scene.enter(ENUM_SCENES_ID.grimoire);
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

    @Hears(EDIT_GRIMOIRE_BUTTON)
    async editGrimoire(@Ctx() ctx: BotContext) {
        ctx.reply('вы попали в меню редактирования гримуара', {
            ...Markup.keyboard([
                [CREATE_SPELL_BUTTON, EDIT_MAGIC_NAME_BUTTON],
                [BACK_BUTTON],
            ]),
        });
        /**
         *
         * @param ctx
         */
    }
    @Action(CREATE_SPELL_BUTTON)
    async createSpell(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_SPELL_FORM_SCENE_ID);
    }

    @Action(EDIT_MAGIC_NAME_BUTTON)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_MAGIC_NAME_SCENE_ID);
    }
}
