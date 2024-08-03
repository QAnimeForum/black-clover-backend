import { Paginated } from 'nestjs-paginate';
import { ArmedForcesMemberEntity } from 'src/modules/squards/entity/armed.forces.member.entity';
import { ArmedForcesRankEntity } from 'src/modules/squards/entity/armed.forces.rank.entity';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export const armedForcesRanksInfo = (
    ranks: Paginated<ArmedForcesRankEntity>
): string => {
    let caption = '<strong>Ранги</strong>';
    ranks.data.map((rank) => {
        caption += `${rank.name}\n`;
    });
    return caption;
};

export const armedForcesMembers = (
    members: Paginated<ArmedForcesMemberEntity>
): [string, InlineKeyboardButton[][]] => {
    const title = '<strong><u>СПИСОК </u></strong>\n';
    let caption = title;
    const keyboard = [
        [
            Markup.button.callback('Сортировать по рангу', 'SORT_BY_RANK'),
            Markup.button.callback(
                'Сортировать по должности',
                'SORT_BY_JOB_TITLE'
            ),
        ],
        [
            Markup.button.callback('Сортировать по имени', 'SORT_BY_NAME'),
            Markup.button.callback('Сортировать по отряду', 'SORT_BY_SQUAD'),
        ],
    ];
    members.data.map((member, index) => {
        const item = `${index + 1}) ${member.character.background.name}, ${member.character.grimoire.magicName}, ${member.rank.name}`;
        caption += item;
        keyboard.push([
            Markup.button.callback(
                member.character.background.name,
                `MEMBER:${member.character.id}`
            ),
        ]);
    });
    return [caption, keyboard];
};
