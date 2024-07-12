import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { WalletEntity } from 'src/modules/money/entity/wallet.entity';
import { BotContext } from '../interfaces/bot.context';
import { Markup } from 'telegraf';
import {
    ADD_QUOTES_BUTTON,
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
    REMOVE_QUOTES_BUTTON,
    SHOW_APPEARANCE_BUTTON,
    SHOW_ATTACHMENTS_BUTTON,
    SHOW_CHRACTER_TRAITS_BUTTON,
    SHOW_FULL_BACKGROUND_BUTTON,
    SHOW_GOALS_BUTTON,
    SHOW_HISTORY_BUTTON,
    SHOW_HOBBIES_BUTTON,
    SHOW_QUOTES_BUTTON,
    SHOW_WEAKNESS_BUTTON,
    SHOW_WORLDVIEW_BUTTON,
} from '../constants/button-names.constant';
import { BackgroundEntity } from 'src/modules/character/entity/background.entity';
import { KNIGHT_IMAGE_PATH } from '../constants/images';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { button } from 'telegraf/typings/markup';

export const fullProfileToText = (
    character: CharacterEntity,
    username: string,
    senderId: string
) => {
    const background = character.background;

    const name = `<strong>🏷️Имя</strong>: ${background.name}`;
    const sex = `<strong>⚧Пол</strong>: ${background.sex}`;
    const age = `<strong>🕐Возраст</strong>: ${background.age}`;
    const state = `<strong>🌍Страна происхождения</strong>: ${background.state.name}`;
    const race = `<strong>👤Раса</strong>: ${background.race.name}`;
    const title = `<strong><u>ПРОФИЛЬ</u></strong>\n\n`;
    const owner = `<strong>👤Владелец</strong>: @${username}`;
    const userId = `<strong>🆔Ваш id</strong>: <code>${senderId}</code>`;
    const magicTypeBlock = `<strong>🃏Магический атрибут</strong>: ${character?.grimoire?.magicName ?? '-'}\n`;

    const characteristics = character.characterCharacteristics;
    const levelBlock = `<strong>🏆Уровень персонажа</strong>: ${characteristics.currentLevel}/${characteristics.maxLevel}\n`;
    const sanityBlock = `<strong>🤪Здравомыслие</strong>: ${characteristics.sanity}`;
    //    const hpBlock = `<strong>🏃Ловкость</strong>: ${characteristics.dexterity.score}`;
    const constitutionBlock = `<strong>🏋️Телосложение</strong>: ${characteristics.constitution.score}`;
    const intelligenceBlock = `<strong>🎓Интеллект</strong>: ${characteristics.intelligence.score}`;
    const wisdomBlock = `<strong>📚Мудрость</strong>: ${characteristics.wisdom.score}`;
    const charismaBlock = `<stron>♥️Уровень здоровья</strong>: ${characteristics.currentHealth}/${characteristics.maxHealth}`;
    const hpBlock = `<strong>♥️Уровень здоровья</strong>: ${characteristics.currentHealth}/${characteristics.maxHealth}`;
    const magicPowerBlock = `<strong>🌀Магическая сила</strong>: ${characteristics.magicPower}`;
    const strengthBlock = `<strong>💪Сила</strong>: ${characteristics.strength.score}`;
    const dexterityBlock = `g>🗣Харизма</strong>: ${characteristics.charisma.score}`;
    const wallet = character.wallet;
    //  const wallet = character.wallet;
    const copperText = `${wallet.copper} 🟤`;
    const silverText = `${wallet.silver} ⚪️`;
    const electrumText = `${wallet.electrum} 🔵`;
    const goldTextText = `${wallet.gold} 🟡`;
    const platinumText = `${wallet.platinum} 🪙`;
    const walletText = `👛Кошелёк: ${platinumText} ${goldTextText} ${electrumText} ${silverText} ${copperText} \n`;
    //   const armorClassBlock = `${characteristics.armorClass.}${characteristics.armorClassBlock.name}${characteristics.armorClassBlock.score}`;

    // const characteristicsTitle = `\n<strong><u>Характеристики персонажа</u></strong>\n\n`;
    // const characteristicsBlock = `${levelBlock}\n${hpBlock}\n${magicPowerBlock}\n${sanityBlock}\n${strengthBlock}\n${dexterityBlock}\n${constitutionBlock}\n${intelligenceBlock}\n${wisdomBlock}\n${charismaBlock}\n`;
    const spellsBlock = `<strong>☄️Заклинания</strong>\n У вас заклинаний нет`;
    const devilsBlock = `<strong>😈Дьяволы:</strong>\n Контрактов с дьяволами нет`;
    const spiritsBlock = `<strong>🧚Духи:</strong>\n Союза с духами нет`;
    const equippedItemsBlock = `<strong>🤹Оборудованные предметы:</strong>\n Ничего не надето`;
    const caption = `${title}${owner}\n${userId}\n${name}\n${levelBlock}\n${sanityBlock}\n${hpBlock}\n${magicPowerBlock}\n\n${sex}\n${age}\n${state}\n${race}\n${magicTypeBlock}\n${walletText}\n${spellsBlock}\n${devilsBlock}\n${spiritsBlock}\n${equippedItemsBlock}`;
    return caption;
};

export const walletToText = (wallet: WalletEntity) => {
    const copperText = `🟤Медная (мм): ${wallet.copper}\n`;
    const silverText = `⚪️Серебряная (см): ${wallet.silver}\n`;
    const electrumText = `🔵Электрумовая (эм): ${wallet.electrum}\n`;
    const goldTextText = `🟡Золотая (зм): ${wallet.gold}\n`;
    const platinumText = `🪙 Платиновая (пм): ${wallet.platinum}\n`;

    const caption = `👛Мой кошелёк\n\n💵Наличные\n\n${platinumText}${goldTextText}${electrumText}${silverText}${copperText}\n`;
    return caption;
};

export const backgroundShowButtons = () => {
    const buttons = [
        [
            Markup.button.callback(
                SHOW_HISTORY_BUTTON,
                ENUM_ACTION_NAMES.SHOW_HISTORY_ACTION
            ),
            Markup.button.callback(
                SHOW_APPEARANCE_BUTTON,
                ENUM_ACTION_NAMES.SHOW_APPEARANCE_ACTION
            ),
        ],
        [
            Markup.button.callback(
                SHOW_HOBBIES_BUTTON,
                ENUM_ACTION_NAMES.SHOW_HOBBIES_ACTION
            ),
            Markup.button.callback(
                SHOW_GOALS_BUTTON,
                ENUM_ACTION_NAMES.SHOW_GOALS_ACTION
            ),
        ],
        [
            Markup.button.callback(
                SHOW_WORLDVIEW_BUTTON,
                ENUM_ACTION_NAMES.SHOW_WORLDVIEW_ACTION
            ),
            Markup.button.callback(
                SHOW_CHRACTER_TRAITS_BUTTON,
                ENUM_ACTION_NAMES.SHOW_TRAITS_ACTION
            ),
        ],
        [
            Markup.button.callback(
                SHOW_ATTACHMENTS_BUTTON,
                ENUM_ACTION_NAMES.SHOW_ATTACHMENTS_ACTION
            ),
            Markup.button.callback(
                SHOW_WEAKNESS_BUTTON,
                ENUM_ACTION_NAMES.SHOW_WEAKNESSS_ACTION
            ),
        ],
        [
            Markup.button.callback(
                SHOW_QUOTES_BUTTON,
                ENUM_ACTION_NAMES.SHOW_QUOTES_ACTION
            ),
            Markup.button.callback(
                SHOW_FULL_BACKGROUND_BUTTON,
                ENUM_ACTION_NAMES.SHOW_ALL_BACKGROUND_ACTION
            ),
        ],
    ];
    return buttons;
};
export const backgroundEditButtons = () => {
    const buttons = [
        [
            Markup.button.callback(EDIT_NAME_BUTTON, EDIT_NAME_BUTTON),
            Markup.button.callback(EDIT_AVATAR_BUTTON, EDIT_AVATAR_BUTTON),
        ],
        [
            Markup.button.callback(EDIT_HISTORY_BUTTON, EDIT_HISTORY_BUTTON),
            Markup.button.callback(
                EDIT_APPEARANCE_BUTTON,
                EDIT_APPEARANCE_BUTTON
            ),
        ],
        [
            Markup.button.callback(EDIT_GOALS_BUTTON, EDIT_GOALS_BUTTON),
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
            Markup.button.callback(EDIT_IDEALS_BUTTON, EDIT_IDEALS_BUTTON),
        ],
        [
            Markup.button.callback(
                EDIT_ATTACHMENTS_BUTTON,
                EDIT_ATTACHMENTS_BUTTON
            ),
            Markup.button.callback(EDIT_WEAKNESS_BUTTON, EDIT_WEAKNESS_BUTTON),
        ],
        [Markup.button.callback(EDIT_HOBBIES_BUTTON, EDIT_HOBBIES_BUTTON)],
        [
            Markup.button.callback(ADD_QUOTES_BUTTON, ADD_QUOTES_BUTTON),
            Markup.button.callback(REMOVE_QUOTES_BUTTON, REMOVE_QUOTES_BUTTON),
        ],
        [Markup.button.callback(EDIT_QUOTE_BUTTON, EDIT_QUOTE_BUTTON)],
    ];
    return buttons;
};

export const shortBackgroundToText = (
    background: BackgroundEntity,
    username: string,
    senderId: string
) => {
    const name = `<strong>Имя</strong>: ${background.name}\n`;
    const sex = `<strong>Пол</strong>: ${background.sex}\n`;
    const age = `<strong>Возраст</strong>: ${background.age}\n`;
    const owner = `<strong>Владелец</strong>: @${username}\n`;
    const userId = `<strong>id</strong>: <code>${senderId}</code>\n\n`;
    const appearance = `<strong>Описание внешности</strong>\n${background.appearance}\n`;
    const state = `<strong>Страна происхождения</strong>: ${background.state.name}\n`;
    const race = `<strong>Раса</strong>: ${background.race.name}\n`;
    const caption = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${name}${sex}${age}${state}${race}${appearance}`;
    return caption;
};

export const showFullBackgroundToText = async (
    ctx: BotContext,
    background: BackgroundEntity,
    username: string,
    senderId: string
) => {
    const history = `<strong>Предыстория пероснажа</strong>\n${background.history}\n`;
    const hobbies = `<strong>Хобби</strong>\n${background.hobbies}\n`;
    const goals = `<strong>Цели</strong>\n${background.goals}\n`;
    const worldview = `<strong>Мировоззрение персонажа</strong>: ${background.worldview}\n`;
    const characterTraits = `<strong>Черты характера</strong>: ${background.characterTraits}\n`;
    const ideals = `<strong>Идеалы</strong>\n${background.ideals}\n`;
    const attachments = `<strong>Привязанности</strong>\n${background.attachments}\n`;
    const weaknesses = `<strong>Слабости</strong>: ${background.weaknesses}\n`;

    let quotes = `<strong>Цитаты</strong>\n`;
    background.quotes.map((quote, index) => {
        quotes += `${index}) ${quote}\n`;
    });
    const owner = `<strong>Владелец</strong>: @${username}\n`;
    const userId = `<strong>id</strong>: <code>${senderId}</code>\n\n`;
    const caption = shortBackgroundToText(background, username, senderId);
    const caption1 = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${characterTraits}${worldview}${hobbies}${ideals}`;
    const caption2 = `<strong><u>ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</u></strong>\n${owner}${userId}${goals}${weaknesses}${attachments}${quotes}`;

    await ctx.sendPhoto(
        {
            source: KNIGHT_IMAGE_PATH,
        },
        {
            caption,
            parse_mode: 'HTML',
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
};
/**
 *      const senderId = sender.id;
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
 */
