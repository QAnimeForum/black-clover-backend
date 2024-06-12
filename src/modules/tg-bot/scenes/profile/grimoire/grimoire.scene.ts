import { Action, Ctx, Hears, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { GrimoireService } from '../../../../grimoire/services/grimoire.service';
import { GRIMOURE_IMAGE_PATH } from '../../../constants/images';
import { TelegrafExceptionFilter } from '../../../filters/tg-bot.filter';
import { BotContext } from '../../../interfaces/bot.context';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    BACK_BUTTON,
    EDIT_SPELL_BUTTON,
    SHOW_FULL_GRIMOIRE,
} from 'src/modules/tg-bot/constants/button-names.constant';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';

@Scene(ENUM_SCENES_ID.GRIMOIRE_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class GrimoreScene {
    constructor(
        private readonly grimoireService: GrimoireService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext, @Sender('id') tgId: number) {
        const grimoire: GrimoireEntity =
            await this.grimoireService.findGrimoireByUserTgId(tgId);

        const spells = grimoire.spells;
        const title = '<strong><u>ГРИМУАР</u></strong>\n\n';
        const magicBlock = `<strong>Магия</strong>: ${grimoire.magicName}\n`;
        const statusBlock = `<strong>Статус</strong>: ${grimoire.status}\n`;
        const coverBlock = `<strong>Обложка</strong>: ${grimoire.coverSymbol}`;
        let caption = `${title}${magicBlock}${coverBlock}${statusBlock}\n`;
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
                            SHOW_FULL_GRIMOIRE,
                            SHOW_FULL_GRIMOIRE
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
    }

    @Hears(BACK_BUTTON)
    async profile(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
