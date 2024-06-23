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
} from '../constants/button-names.constant';
import { SpellEntity } from 'src/modules/grimoire/entity/spell.entity';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';
import { ENUM_GRIMOIRE_STATUS } from 'src/modules/grimoire/constants/grimoire.enum.constant';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../constants/action-names.constant';

export type GrimoireWithNavigation = {
    text: string;
    buttons: any;
};
export const convertGrimoiresToTextAndInlineButtons = (
    paginatedGrimoires: Paginated<GrimoireEntity>
): GrimoireWithNavigation => {
    const { data, meta } = paginatedGrimoires;
    const { currentPage, totalPages, itemsPerPage, totalItems } = meta;
    let text = `<strong>Общее количество гримуаров:</strong> ${totalItems}\n\n`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((grimoire, index) => {
        const grimoireIndex = (currentPage - 1) * itemsPerPage + index + 1;
        const grimoireStatus = grimoireStatusToText(grimoire.status);
        const line = `<u>Гримуар № ${grimoireIndex}</u>\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус: </strong>${grimoireStatus}\n\n`;
        text += line;
        buttons.push([
            Markup.button.callback(
                `Гримуар №  ${grimoireIndex}`,
                `${ENUM_ACTION_NAMES.GRIMOIRE_INFO_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${grimoire.id}${ENUM_ACTION_NAMES.DELIMITER}${currentPage}`
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
    console.log(buttons);
    return {
        text,
        buttons,
    };
};
const spellStatusToText = (status: ENUM_SPELL_STATUS) => {
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

const spellTypeToText = (status: ENUM_SPELL_TYPE) => {
    switch (status) {
        case ENUM_SPELL_TYPE.CREATION:
            return 'магия созидания';
        case ENUM_SPELL_TYPE.HEALING:
            return 'Магия лечения';
        case ENUM_SPELL_TYPE.COMPOUND:
            return 'Комбинированая магия';
        case ENUM_SPELL_TYPE.CURSE:
            return 'Проклятие';
        case ENUM_SPELL_TYPE.FORBIDDEN:
            return 'Запретная магия';
        case ENUM_SPELL_TYPE.REINCARNATION:
            return 'Магия реинкарнации';
        case ENUM_SPELL_TYPE.REINFORCEMENT:
            return 'Магия усиления';
        case ENUM_SPELL_TYPE.RESTRAINING:
            return 'магия ограничения';
        case ENUM_SPELL_TYPE.SEAL:
            return 'Печать';
        case ENUM_SPELL_TYPE.TRAP:
            return 'ловушка';
        case ENUM_SPELL_TYPE.WEAKING:
            return 'магия ослабления';
        case ENUM_SPELL_TYPE.OTHER:
            return 'другой вариант';
        default:
            return '';
    }
};

const grimoireStatusToText = (status: ENUM_GRIMOIRE_STATUS) => {
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
    const title = `<strong><u>Заклинание ${index}</u></strong>`;
    const name = `<strong>Название: </strong> ${spell.name}`;
    const status = `<strong>Статус: </strong> ${spellStatusToText(spell.status)}`;
    const type = `<strong>Тип: </strong> ${spellTypeToText(spell.type)}`;
    const damage = `<strong>Урон: </strong> ${spell.damage}`;
    const range = `<strong>Область действия заклинания: </strong> ${spell.range}`;
    const duration = `<strong>Продолжительность: </strong> ${spell.duration}`;
    const cost = `<strong>Стоимость: </strong> ${spell.cost}`;
    const castTime = `<strong>Сколько времени нужно для создания заклинания: </strong> ${spell.castTime}`;
    const cooldown = `<strong>Время отката заклинания: </strong> ${spell.cooldown}`;
    const goals = `<strong>Цели: </strong> ${spell.goals}`;
    const minLevel = `<strong>Минимальный уровень персонажа: </strong> ${spell.requirements.minimalLevel}`;
    const requipments = '<strong>Требования: </strong>';
    const description = `<strong>Описание</strong>\n ${spell.description}`;
    const caption = `${title}\n${name}\n${status}\n${type}\n${damage}\n${range}\n${duration}\n${cost}\n${castTime}\n${cooldown}\n${goals}\n${minLevel}\n${requipments}\n${description}`;
    return caption;
};

export const grimoireToText = (grimoire: GrimoireEntity | null) => {
    const spells = grimoire.spells;
    const grimoireStatus = grimoireStatusToText(grimoire.status);
    let caption = `<strong><u>ГРИМУАР</u></strong>\n\n<strong>Маг. атрибут:</strong> ${grimoire.magicName}\n<strong>Символ на обложке:</strong>${grimoire.coverSymbol}\n<strong>Статус:</strong> ${grimoireStatus}\n`;
    caption += '<strong><u>ЗАКЛИНАНИЯ</u></strong>\n';
    const buttons = [];
    spells.map((spell, index) => {
        const status = spellStatusToText(spell.status);
        caption += `${index + 1}) ${spell.name}, cтатус: ${status}\n`;
        buttons.push([Markup.button.callback(spell.name, `SPELL:${spell.id}`)]);
    });
    if (spells.length == 0) caption += 'Заклинаний нет';
    return caption;
};

export const grimoireInlineKeyboard = () => {
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
export const spellEditInlineKeyboard = () => {
    const buttons = [
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
                EDIT_SPELL_MINIMAL_LEVEL_BUTTON,
                EDIT_SPELL_MINIMAL_LEVEL_BUTTON
            ),
        ],
        [
            Markup.button.callback(
                EDIT_SPELL_CHANGE_STATUS_BUTTON,
                EDIT_SPELL_CHANGE_STATUS_BUTTON
            ),
        ],
        [Markup.button.callback(BACK_BUTTON, 'BACK_TO_GRIMOIRE')],
    ];
    return buttons;
};
