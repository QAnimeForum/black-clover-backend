import { Paginated } from 'nestjs-paginate';
import { DevilEntity } from 'src/modules/devils/entity/devil.entity';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { BACK_BUTTON } from '../constants/button-names.constant';
import { ENUM_DEVIL_RANK } from 'src/modules/devils/constants/devil.ranks.enum';
import { button } from 'telegraf/typings/markup';

export const devilListToButtons = (
    devils: Paginated<DevilEntity>,
    backType: string
) => {
    const { data, meta } = devils;
    const { currentPage, totalPages } = meta;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((devil: DevilEntity) => {
        buttons.push([
            Markup.button.callback(`${devil.name}`, `DEVIL_ID:${devil.id}`),
        ]);
    });
    if (totalPages == 0) {
        buttons.push([Markup.button.callback(`1 из 1`, `PAGE`)]);
    } else if (currentPage == 1 && totalPages == 1) {
        buttons.push([
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else if (currentPage == 1 && totalPages > 1) {
        buttons.push([
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(`>>`, `DEVILS_NEXT_PAGE:${currentPage + 1}`),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `DEVILS_PREVIOUS_PAGE:${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `DEVILS_PREVIOUS_PAGE:${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(`>>`, `DEVILS_NEXT_PAGE:${currentPage + 1}`),
        ]);
    }
    buttons.push([Markup.button.callback(BACK_BUTTON, `BACK_TO_DEVIL_SORT`)]);
    return buttons;
};
export const defilInformationToText = (devil: DevilEntity) => {
    let caption = `<strong>Профиль дьявола</strong>\n\n`;
    caption += `<strong>Имя</strong>: ${devil.name}\n`;
    caption += `<strong>Магический атрибут</strong>: ${devil.magicType}\n`;
    caption += `<strong>Этаж</strong>: ${devil.floor}\n`;
    caption += `<strong>Ранг</strong>: ${magicRank(devil.rank)}\n`;

    caption += `<strong>Описание</strong>\n${devil.description}\n`;
    return caption;
};

export const magicRank = (rank: ENUM_DEVIL_RANK) => {
    switch (rank) {
        case ENUM_DEVIL_RANK.HIGHEST: {
            return 'Высший дьявол';
        }
        case ENUM_DEVIL_RANK.HIGH: {
            return 'Высокоранговый дьявол';
        }
        case ENUM_DEVIL_RANK.MID: {
            return 'Среднеранговый дьявол';
        }
        case ENUM_DEVIL_RANK.LOW: {
            return 'Низкоранговый дьявол';
        }
    }
};

export const devilUnionToText = () => {
    const caption = `<strong>Единение с дьяволом</strong>`;
    return caption;
};

export const devilButtons = (devilId: string, isAdmin: boolean) => {
    const buttons = [
        [
            Markup.button.callback(`Единение 10%`, `DEVIL_UNION:${devilId}:10`),
            Markup.button.callback(`Единение 25%`, `DEVIL_UNION:${devilId}:25`),
        ],

        [
            Markup.button.callback(`Единение 50%`, `DEVIL_UNION:${devilId}:50`),
            Markup.button.callback(`Единение 65%`, `DEVIL_UNION:${devilId}:65`),
        ],
        [
            Markup.button.callback(`Единение 80%`, `DEVIL_UNION:${devilId}:80`),
            Markup.button.callback(
                `Единение 100%`,
                `DEVIL_UNION:${devilId}:100`
            ),
        ],
        [
            Markup.button.callback(
                `Показать все единения`,
                `SHOW_ALL_DEVIL_UNIONS:${devilId}`
            ),
        ],
    ];
    if (isAdmin) {
        buttons.push([
            Markup.button.callback(
                `Редактирование дьявола`,
                `EDIT_INFORMATION:${devilId}`
            ),
        ]);
    }
    buttons.push([Markup.button.callback(BACK_BUTTON, `BACK_TO_DEVIL_LIST`)]);
    return buttons;
};
