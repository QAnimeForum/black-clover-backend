import { ENUM_SPELL_STATUS } from 'src/modules/grimoire/constants/spell.status.enum.constant';
import { ENUM_SPELL_TYPE } from 'src/modules/grimoire/constants/spell.type.enum';
import { Markup } from 'telegraf';
import {
    EDIT_SPELL_NAME_BUTTON,
    EDIT_SPELL_DESCRIPTION_BUTTON,
    EDIT_SPELL_TYPE_BUTTON,
    EDIT_SPELL_COST_BUTTON,
    EDIT_SPELL_DURATION_BUTTON,
    EDIT_SPELL_COOLDOWN_BUTTON,
    EDIT_SPELL_GOALS_BUTTON,
    EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
    EDIT_SPELL_CHANGE_STATUS_BUTTON,
    BACK_BUTTON,
    ADD_SPELL_BUTTON,
    CHANGE_GRIMOIRE_STATUS,
    EDIT_MAGIC_NAME_BUTTON,
    DELETE_SPELL_BUTTON,
    EDIT_SPELL_DAMAGE_BUTTON,
    EDIT_SPELL_RANGE_BUTTON,
    EDIT_SPELL_CAST_TIME_BUTTON,
} from '../constants/button-names.constant';
import { SpellEntity } from 'src/modules/grimoire/entity/spell.entity';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';
import { ENUM_GRIMOIRE_STATUS } from 'src/modules/grimoire/constants/grimoire.enum.constant';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import {
    MAX_COUNT_CREATION_SPELLS,
    MAX_COUNT_CURSES_SPELLS,
    MAX_COUNT_HEALING_SPELLS,
    MAX_COUNT_RESTRAINING_SPELLS,
    MAX_COUNT_SEAL_SPELLS,
    MAX_COUNT_TRAP_SPELLS,
    MAX_LEVEL_CREATION_SPELLS,
    MAX_LEVEL_FORBIDDEN_SPELLS,
    MAX_LEVEL_HEALING_SPELLS,
    MAX_LEVEL_REINFORCEMENT_SPELLS,
    MAX_LEVEL_RESTRAINING_SPELLS,
    MAX_LEVEL_SEAL_SPELLS,
    MAX_LEVEL_TRAP_SPELLS,
} from '../constants/grimoire-max-levels.constant';
import { GrimoireReservationEntity } from 'src/modules/grimoire/entity/grimoire.reservation.entity';

export type GrimoireWithNavigation = {
    text: string;
    buttons: any;
};
export const convertGrimoiresToTextAndInlineButtons = (
    paginatedGrimoires: Paginated<CharacterEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = paginatedGrimoires;
    const { currentPage, totalPages, itemsPerPage, totalItems } = meta;
    let text = `<strong>Общее количество гримуаров:</strong> ${totalItems}\n\n`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((character, index) => {
        const grimoire = character.grimoire;
        if (grimoire) {
            const grimoireIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const grimoireStatus = grimoireStatusToText(grimoire.status);
            const line = `<u>Гримуар № ${grimoireIndex}</u>\n<strong>Владелец: </strong>${character.background.name}\n<strong>ID</strong>: <code>${character.user.tgUserId}\n</code><strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n\n`;
            text += line;
            buttons.push([
                Markup.button.callback(
                    `Гримуар №  ${grimoireIndex}`,
                    `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${currentPage}`
                ),
            ]);
        }
        /**
        * v const grimoireIndex = (currentPage - 1) * itemsPerPage + index + 1;
       const grimoireStatus = grimoireStatusToText(grimoire.status);
        const line = `<u>Гримуар № ${grimoireIndex}</u>\n<strong>Владелец: </strong>${character.background.name}\n<strong>ID</strong>: <code>${character.user.tgUserId}\n</code><strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n\n`;
        text += line;
        buttons.push([
            Markup.button.callback(
                `Гримуар №  ${grimoireIndex}`,
                `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${currentPage}`
            ),
        ]);
        */
    });

    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    /*    buttons.push(
        [
            Markup.button.callback('Все гримуары', `ALL_APPROVED_GRIMORE`),
            Markup.button.callback('В работе у меня', `MY_GRIMOIRE`),
        ],
        [
            Markup.button.callback('Все неободренные', `NOT_APPROVED_GRIMORE`),
            Markup.button.callback('Все одобренные', `APPROVED_GRIMORE`),
        ]
    );*/

    return [text, buttons];
};
export const spellStatusToText = (status: ENUM_SPELL_STATUS) => {
    switch (status) {
        case ENUM_SPELL_STATUS.DRAFT:
            return 'Черновик';
        case ENUM_SPELL_STATUS.NOT_APPROVED:
            return 'На одобрении';
        case ENUM_SPELL_STATUS.APPROVED:
            return 'Одобрено';
        default:
            return '';
    }
};

export const spellTypeToText = (status: ENUM_SPELL_TYPE) => {
    switch (status) {
        case ENUM_SPELL_TYPE.CREATION:
            return 'магия созидания';
        case ENUM_SPELL_TYPE.HEALING:
            return 'Магия лечения';
        /*   case ENUM_SPELL_TYPE.COMPOUND:
            return 'Комбинированая магия';*/
        case ENUM_SPELL_TYPE.CURSE:
            return 'Проклятие';
        case ENUM_SPELL_TYPE.FORBIDDEN:
            return 'Запретная магия';
        /* case ENUM_SPELL_TYPE.REINCARNATION:
            return 'Магия реинкарнации';*/
        case ENUM_SPELL_TYPE.REINFORCEMENT:
            return 'Магия усиления';
        case ENUM_SPELL_TYPE.RESTRAINING:
            return 'магия ограничения';
        case ENUM_SPELL_TYPE.SEAL:
            return 'Печать';
        case ENUM_SPELL_TYPE.TRAP:
            return 'Ловушка';
        case ENUM_SPELL_TYPE.WEAKING:
            return 'Магия ослабления';
        case ENUM_SPELL_TYPE.DEVIL_UNION:
            return 'Единение с дьяволом';
        case ENUM_SPELL_TYPE.OTHER:
            return 'другой вариант';
        default:
            return '';
    }
};

export const grimoireStatusToText = (status: ENUM_GRIMOIRE_STATUS) => {
    switch (status) {
        case ENUM_GRIMOIRE_STATUS.APPROVED: {
            return 'Грмуар одобрен';
        }
        case ENUM_GRIMOIRE_STATUS.NOT_APPROVED: {
            return 'Гримуар не одобрен';
        }
        default:
            return '';
    }
};
export const spellToText = (spell: SpellEntity, index?: number) => {
    console.log(spell);
    const title = `<strong><u>Заклинание ${index ?? ''}</u></strong>`;
    const name = `<strong>Название: </strong> ${spell.name}`;
    const status = `<strong>Статус: </strong> ${spellStatusToText(spell.status)}`;
    const type = `<strong>Тип: </strong> ${spellTypeToText(spell.type)}`;
    const damage = `<strong>Урон: </strong> ${spell.damage}`;
    const range = `<strong>Область действия заклинания: </strong> ${spell.range}`;
    const duration = `<strong>Продолжительность: </strong> ${spell.duration}`;
    const cost = `<strong>Стоимость: </strong> ${spell.cost}`;
    const castTime = `<strong>Время каста заклинания: </strong> ${spell.castTime}`;
    const cooldown = `<strong>Время отката заклинания: </strong> ${spell.cooldown}`;
    const goals = `<strong>Цели: </strong> ${spell.goals}`;
    //  const minLevel = `<strong>Минимальный уровень персонажа: </strong> ${spell.minimalCharacterLevel}`;
    //  const requipments = `<strong>Требования: </strong>  ${spell.requirements}`;
    const description = `<strong>Описание</strong>\n ${spell.description}`;
    const caption = `${title}\n${name}\n${status}\n${type}\n${damage}\n${range}\n${duration}\n${cost}\n${castTime}\n${cooldown}\n${goals}\n${description}`;
    return caption;
};

export const grimoireToText = (character: CharacterEntity) => {
    const grimoire = character.grimoire;
    const spells = grimoire.spells;
    const grimoireStatus = grimoireStatusToText(grimoire.status);
    let caption = `<strong><u>ГРИМУАР</u></strong>\n\n`;
    caption += `<strong>Владелец:</strong> ${character.background.name}\n`;
    caption += `<strong>ID</strong>: <code>${character.user.tgUserId}</code>\n`;

    caption += manaZoneText(grimoire);
    //  caption += `<strong>Уровень персонажа: </strong>${character.characterCharacteristics.currentLevel}\n`;
    //   caption += `<strong>Максимальное возможное количество заклинаний: </strong>${maxEvailableSpells(character.characterCharacteristics.currentLevel)}\n\n`;
    caption += `<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n`;
    caption += `<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n`;
    caption += `<strong>Статус:</strong> ${grimoireStatus}\n\n`;
    caption += '<strong><u>ЗАКЛИНАНИЯ</u></strong>\n';

    spells.map((spell, index) => {
        const status = spellStatusToText(spell.status);
        caption += `${index + 1}) ${spell.name}, cтатус: ${status}\n`;
    });
    if (spells.length == 0) caption += 'Заклинаний нет';
    return caption;
};

export const manaZoneText = (grimoire: GrimoireEntity) => {
    let caption = `<strong>Зона маны</strong>:\n`;
    if (grimoire.manaZone) {
        caption += `${grimoire.manaZone.name}, уровень: ${grimoire.manaZone.level}`;
    } else {
        caption +=
            'Зона маны не изучена. Для открытия необхоимы спец. тренировки.\n\n';
    }
    return caption;
};

export const maxEvailableCreationSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(1, 2);
    spellLevels.set(2, 3);
    spellLevels.set(3, 4);
    spellLevels.set(4, 4);
    spellLevels.set(5, 5);
    spellLevels.set(6, 6);
    spellLevels.set(7, 6);
    spellLevels.set(8, 7);
    spellLevels.set(9, 7);
    spellLevels.set(10, 8);
    spellLevels.set(11, 9);
    return spellLevels.get(level);
};

export const maxEvailableHealSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};

export const maxEvailableCursesSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};

export const maxForbiddenSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};
export const maxEvailableReinforcementSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};

export const maxEvailableRestrainingSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};

export const maxEvailableSealSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};

export const maxEvailableTrapSpells = (level: number) => {
    // максимальное количесво заклинаний на каждом уровне
    // ключ - уровень
    // значение - максимальное количество заклинаний без единений
    const spellLevels = new Map();
    spellLevels.set(0, 0);
    spellLevels.set(1, 1);
    spellLevels.set(2, 2);
    spellLevels.set(3, 3);
    spellLevels.set(4, 4);
    return spellLevels.get(level);
};
export const grimoireAdminInlineKeyboard = () => {
    const buttons = [];
    buttons.push(
        [
            Markup.button.callback(
                EDIT_MAGIC_NAME_BUTTON,
                EDIT_MAGIC_NAME_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                CHANGE_GRIMOIRE_STATUS,
                CHANGE_GRIMOIRE_STATUS
            ),
        ],
        [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)]
    );
    return buttons;
};
export const grimoireTowerInlineKeyboard = () => {
    const buttons = [];
    buttons.push(
        [
            Markup.button.callback(
                EDIT_MAGIC_NAME_BUTTON,
                EDIT_MAGIC_NAME_BUTTON
            ),
        ],
        [Markup.button.callback(ADD_SPELL_BUTTON, ADD_SPELL_BUTTON)],
        [
            Markup.button.callback(
                CHANGE_GRIMOIRE_STATUS,
                CHANGE_GRIMOIRE_STATUS
            ),
        ],
        [Markup.button.callback(BACK_BUTTON, BACK_BUTTON)]
    );
    return buttons;
};
export const spellEditInlineKeyboard = (
    grimoireId: string,
    spellId: string
) => {
    const buttons = [
        [
            Markup.button.callback(
                DELETE_SPELL_BUTTON,
                `DELETE_SPELL:${spellId}`
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_NAME_BUTTON,
                EDIT_SPELL_NAME_BUTTON
            ),
            Markup.button.callback(
                EDIT_SPELL_DESCRIPTION_BUTTON,
                EDIT_SPELL_DESCRIPTION_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_TYPE_BUTTON,
                EDIT_SPELL_TYPE_BUTTON
            ),
            Markup.button.callback(
                EDIT_SPELL_COST_BUTTON,
                EDIT_SPELL_COST_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_DURATION_BUTTON,
                EDIT_SPELL_DURATION_BUTTON
            ),
            Markup.button.callback(
                EDIT_SPELL_COOLDOWN_BUTTON,
                EDIT_SPELL_COOLDOWN_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_GOALS_BUTTON,
                EDIT_SPELL_GOALS_BUTTON
            ),
            Markup.button.callback(
                EDIT_SPELL_DAMAGE_BUTTON,
                EDIT_SPELL_DAMAGE_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_CAST_TIME_BUTTON,
                EDIT_SPELL_CAST_TIME_BUTTON
            ),
            Markup.button.callback(
                EDIT_SPELL_RANGE_BUTTON,
                EDIT_SPELL_RANGE_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_CHANGE_STATUS_BUTTON,
                EDIT_SPELL_CHANGE_STATUS_BUTTON
            ),
            Markup.button.callback(
                BACK_BUTTON,
                `GRIMOIRE_INFO:${grimoireId}:MY_GRIMOIRES`
            ),
        ],
    ];
    return buttons;
};

export const grimoireStatisticsToText = (grimoire: GrimoireEntity) => {
    let caption = '<strong><u>Развитие гримуара</u></strong>\n\n';

    caption += manaZoneText(grimoire);
    caption += `<strong><u>Магия созидания</u></strong>\n`;
    caption += `Уровень: ${grimoire.elementalLevel}/${MAX_LEVEL_CREATION_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableCreationSpells(grimoire.elementalLevel)} из ${MAX_COUNT_CREATION_SPELLS} возможных\n`;
    const countCreationSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.CREATION
    ).length;
    caption += `Пользователь знает ${countCreationSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Лечащие заклинания</u></strong>\n`;
    caption += `Уровень: ${grimoire.healingLevel}/${MAX_LEVEL_HEALING_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableHealSpells(grimoire.healingLevel)} из ${MAX_COUNT_HEALING_SPELLS} возможных\n`;
    const countHealingSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.HEALING
    ).length;
    caption += `Пользователь знает ${countHealingSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Проклятья</u></strong>\n`;
    caption += `Уровень: ${grimoire.curseLevel}/${MAX_COUNT_CURSES_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableCursesSpells(grimoire.curseLevel)} из ${MAX_COUNT_CURSES_SPELLS} возможных\n`;
    const countCursesSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.CURSE
    ).length;
    caption += `Пользователь знает ${countCursesSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Запретная магия</u></strong>\n`;
    caption += `Уровень: ${grimoire.forbiddenLevel}/${MAX_LEVEL_FORBIDDEN_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxForbiddenSpells(grimoire.forbiddenLevel)} из ${MAX_LEVEL_FORBIDDEN_SPELLS} возможных\n`;
    const countForbiddenSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.FORBIDDEN
    ).length;
    caption += `Пользователь знает ${countForbiddenSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Магия усиления (не кожа маны)</u></strong>\n`;
    caption += `Уровень: ${grimoire.reinforcementLevel}/${MAX_LEVEL_REINFORCEMENT_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableReinforcementSpells(grimoire.reinforcementLevel)} из ${MAX_LEVEL_REINFORCEMENT_SPELLS} возможных\n`;
    const countReinforcementSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.REINFORCEMENT
    ).length;
    caption += `Пользователь знает ${countReinforcementSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Магия ограничения</u></strong>\n`;
    caption += `Уровень: ${grimoire.restrainingLevel}/${MAX_LEVEL_RESTRAINING_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableRestrainingSpells(grimoire.restrainingLevel)} из ${MAX_COUNT_RESTRAINING_SPELLS} возможных\n`;
    const countRestrainingSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.RESTRAINING
    ).length;
    caption += `Пользователь знает ${countRestrainingSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Печать</u></strong>\n`;
    caption += `Уровень: ${grimoire.sealLevel}/${MAX_LEVEL_SEAL_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableSealSpells(grimoire.sealLevel)} из ${MAX_COUNT_SEAL_SPELLS} возможных\n`;
    const countSealSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.SEAL
    ).length;
    caption += `Пользователь знает ${countSealSpells} заклинаний данного типа\n\n`;

    caption += `<strong><u>Ловушка</u></strong>\n`;
    caption += `Уровень: ${grimoire.trapLevel}/${MAX_LEVEL_TRAP_SPELLS}\n`;
    caption += `Доступно заклинаний: ${maxEvailableTrapSpells(grimoire.trapLevel)} из ${MAX_COUNT_TRAP_SPELLS} возможных\n`;
    const countTrapSpells = grimoire.spells.filter(
        (spell) => spell.type == ENUM_SPELL_TYPE.TRAP
    ).length;
    caption += `Пользователь знает ${countTrapSpells} заклинаний данного типа\n\n`;
    /**
        *  caption += `<strong><u>Другой тип</u></strong>\n`;
        caption += `Уровень: ${grimoire.o}/${MAX_LEVEL_CREATION_SPELLS}\n`;
        caption += `Доступно заклинаний: ${maxEvailableCreationSpells(grimoire.elementalLevel)}\n\n`;

        */
    return caption;
};

export const myGrimoiresToText = (
    grimoireReservations: Paginated<GrimoireReservationEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = grimoireReservations;
    const { currentPage, totalPages, totalItems } = meta;
    const caption = `Мои гримуары\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((reservation: GrimoireReservationEntity) => {
        buttons.push([
            Markup.button.callback(
                `${reservation.grimoire.magicName}.`,
                `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${reservation.grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.MY_GRIMOIRES_ACTION}`
            ),
            Markup.button.callback(
                `➖`,
                `${ENUM_ACTION_NAMES.REMOVE_GRIMOIRE_TO_WORK_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${reservation.id}`
            ),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `MY_GRIMOIRES_NEXT${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `MY_GRIMOIRES_PREVIOUS${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `MY_GRIMOIRES_PREVIOUS${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `MY_GRIMOIRES_NEXT${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};

export const charactersToWorkList = (
    characters: Paginated<CharacterEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = characters;
    const { currentPage, totalPages, totalItems } = meta;
    const caption = `Мои гримуары\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((character: CharacterEntity) => {
        const grimoire = character.grimoire;
        buttons.push([
            Markup.button.callback(
                `${grimoire.magicName}`,
                `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION}`
            ),
            Markup.button.callback(
                `➕`,
                `${ENUM_ACTION_NAMES.ADD_GRIMOIRE_TO_WORK_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}`
            ),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}:GET_GRIMOIRE`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}:GET_GRIMOIRE`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}:GET_GRIMOIRE`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}:GET_GRIMOIRE`
            ),
        ]);
    }
    return [caption, buttons];
};

export const grimoiresToWorkList = (
    characters: Paginated<GrimoireEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = characters;
    const { currentPage, totalPages, totalItems } = meta;
    const caption = `Мои гримуары\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((grimoire: GrimoireEntity) => {
        buttons.push([
            Markup.button.callback(
                `${grimoire.magicName}`,
                `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.GET_GRIMOIRE_TO_WORK_ACTION}`
            ),
            Markup.button.callback(
                `➕`,
                `${ENUM_ACTION_NAMES.ADD_GRIMOIRE_TO_WORK_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}`
            ),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([
            Markup.button.callback(`1 из 1`, ENUM_ACTION_NAMES.PAGE_ACTION),
        ]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_TO_WORK_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}:GET_GRIMOIRE`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_TO_WORK_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}:GET_GRIMOIRE`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_TO_WORK_PREVIOUS_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}:GET_GRIMOIRE`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.GRIMOIRES_TO_WORK_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}:GET_GRIMOIRE`
            ),
        ]);
    }
    return [caption, buttons];
};
