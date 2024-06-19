import { Paginated } from 'nestjs-paginate';
import { DevilEntity } from 'src/modules/devils/entity/devil.entity';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { BACK_BUTTON } from '../constants/button-names.constant';

export const devilListToButtons = (
    devils: Paginated<DevilEntity>,
    backType: string
) => {
    const { data, meta } = devils;
    const { currentPage, totalPages } = meta;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((devil: DevilEntity) => {
        buttons.push([
            Markup.button.callback(`${devil.name}`, `devilId:${devil.id}`),
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
    const nameBlock = `<strong>Имя</strong>: ${devil.name}\n`;
    const floorBLock = `<strong>Этаж</strong>: ${devil.floor}\n`;
    const rankBlock = `<strong>Ранг</strong>: ${devil.rank}\n`;
    const descriptionBlock = `<strong>Описание</strong>\n${devil.description}\n`;
    const text = `<strong>Профиль дьявола</strong>\n\n${nameBlock}${floorBLock}${rankBlock}${descriptionBlock}`;
    return text;
};
