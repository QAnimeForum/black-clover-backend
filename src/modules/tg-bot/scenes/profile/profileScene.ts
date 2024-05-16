import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import {
    GRIMOURE_IMAGE_PATH,
    INVENTORY_IMAGE_PATH,
    KNIGHT_IMAGE_PATH,
} from '../../constants/images';
import { SceneIds } from '../../constants/scenes.id';
import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { UseFilters } from '@nestjs/common';
import { CharacterService } from '../../../character/services/character.service';
import { Markup } from 'telegraf';
import { BUTTON_ACTIONS } from '../../constants/actions';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { GrimoireService } from '../../../grimoire/services/grimoire.service';

@Scene(SceneIds.profile)
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
        const userId = `<strong>Ваш id</strong> <code>${senderId}</code>\n`;
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
                    [
                        BUTTON_ACTIONS.grimoire,
                        BUTTON_ACTIONS.BIO,
                        BUTTON_ACTIONS.params,
                    ],
                    [BUTTON_ACTIONS.WALLET, BUTTON_ACTIONS.INVENTORY],
                    [BUTTON_ACTIONS.myDevils, BUTTON_ACTIONS.mySpirits],
                    [BUTTON_ACTIONS.profile, BUTTON_ACTIONS.back],
                ]).resize(),
            }
        );
    }

    @Hears(BUTTON_ACTIONS.back)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.home);
    }
    @Hears(BUTTON_ACTIONS.grimoire)
    async grimoire(@Ctx() ctx: BotContext, @Sender() sender) {
        const grimoire = await this.grimoireService.findGrimoireByUserTgId(
            sender.id
        );
        const [spellEntities] = await this.grimoireService.findAllSpells(
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

        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        let caption = `${title}${magicBlock}<strong>Обложка</strong>: ${grimoire.coverSymbol}\n`;
        //<strong>Цвет магии</strong>: ${grimoire.magicColor}
        const spellListMessages: Array<{
            id: string;
            text: string;
        }> = [];
        if (spellEntities.length === 0) {
            caption = caption.concat(`У вас нет заклинаний`);
        } else {
            let spellListBlock = '';
            spellListBlock = spellListBlock.concat(
                `<strong>Список заклинаний</strong>\n`
            );
            spellEntities.map((spell, index) => {
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
                            BUTTON_ACTIONS.CREATE_SPELL,
                            BUTTON_ACTIONS.CREATE_SPELL
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.EDIT_MAGIC_NAME,
                            BUTTON_ACTIONS.EDIT_MAGIC_NAME
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.EDIT_MAGIC_COLOR,
                            BUTTON_ACTIONS.EDIT_MAGIC_COLOR
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
                                BUTTON_ACTIONS.EDIT_SPELL,
                                `EDIT_SPELL:${spell.id}`
                            ),
                        ],
                    ]),
                })
        );
        //await ctx.scene.enter(SceneIds.grimoire);
    }
    @Hears(BUTTON_ACTIONS.BIO)
    async bio(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.bio);
    }
    @Hears(BUTTON_ACTIONS.params)
    async params(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.characterParameters);
    }
    @Hears(BUTTON_ACTIONS.WALLET)
    async wallet(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.wallet);
    }
    @Hears(BUTTON_ACTIONS.INVENTORY)
    async inventory(@Ctx() ctx: BotContext, @Sender() sender) {
        const title = '<strong><u>Инвентарь</u></strong>\n\n';
        const owner = `<strong>Владелец</strong>: @${sender.username}\n\n`;
        const equipmentTitle = '<strong><u>Надетая экипировка</u></strong>\n\n';
        const weaponBlock = `${BUTTON_ACTIONS.WEAPONS}:-\n`;
        const armorBlock = `${BUTTON_ACTIONS.ARMOR}: -\n`;
        const jeweiryBlock = `${BUTTON_ACTIONS.JEWEIRY}: -\n`;
        const foodBlock = `${BUTTON_ACTIONS.FOOD}: -\n`;
        const alcoholBlock = `${BUTTON_ACTIONS.ALCOHOL}: -\n`;
        const toolKitBlock = `${BUTTON_ACTIONS.TOOLKIT}: -\n`;
        const gearsBlock = `${BUTTON_ACTIONS.GEARS}: -\n`;
        const vehiclesBlock = `${BUTTON_ACTIONS.VEHICLES}: -\n`;

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
                            BUTTON_ACTIONS.MINERALS,
                            BUTTON_ACTIONS.MINERALS
                        ),
                        Markup.button.callback(
                            BUTTON_ACTIONS.JEWEIRY,
                            BUTTON_ACTIONS.JEWEIRY
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.ALCOHOL,
                            BUTTON_ACTIONS.ALCOHOL
                        ),
                        Markup.button.callback(
                            BUTTON_ACTIONS.FOOD,
                            BUTTON_ACTIONS.FOOD
                        ),
                    ],

                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.WEAPONS,
                            BUTTON_ACTIONS.WEAPONS
                        ),
                        Markup.button.callback(
                            BUTTON_ACTIONS.ARMOR,
                            BUTTON_ACTIONS.ARMOR
                        ),
                    ],
                    [
                        Markup.button.callback(
                            BUTTON_ACTIONS.GEARS,
                            BUTTON_ACTIONS.GEARS
                        ),
                        Markup.button.callback(
                            BUTTON_ACTIONS.VEHICLES,
                            BUTTON_ACTIONS.VEHICLES
                        ),
                    ],
                ]),
            }
        );
    }
    @Hears(BUTTON_ACTIONS.myDevils)
    async myDevils(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.myDevils);
    }

    @Hears(BUTTON_ACTIONS.mySpirits)
    async mySpirits(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.mySpirits);
    }

    @Hears(BUTTON_ACTIONS.EDIT_GRIMOIRE)
    async editGrimoire(@Ctx() ctx: BotContext) {
        ctx.reply('вы попали в меню редактирования гримуара', {
            ...Markup.keyboard([
                [
                    BUTTON_ACTIONS.CREATE_SPELL,
                    BUTTON_ACTIONS.EDIT_MAGIC_NAME,
                    BUTTON_ACTIONS.EDIT_MAGIC_COLOR,
                ],
                [BUTTON_ACTIONS.back],
            ]),
        });
        /**
         *
         * @param ctx
         */
    }
    @Action(BUTTON_ACTIONS.CREATE_SPELL)
    async createSpell(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.createSpell);
    }

    @Action(BUTTON_ACTIONS.EDIT_MAGIC_NAME)
    async editMagicName(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditMagicName);
    }

    @Action(BUTTON_ACTIONS.EDIT_MAGIC_COLOR)
    async editMagicColor(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(SceneIds.grimoireEditMagicColor);
    }
}
