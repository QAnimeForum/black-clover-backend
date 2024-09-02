import {
    Ctx,
    Hears,
    Message,
    On,
    Scene,
    SceneEnter,
    Wizard,
    WizardStep,
    Command,
    Action,
    Sender,
} from 'nestjs-telegraf';
import { ADMIN_IMAGE_PATH } from '../../constants/images';

import { TelegrafExceptionFilter } from '../../filters/tg-bot.filter';
import { BotContext } from '../../interfaces/bot.context';
import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { UserService } from 'src/modules/user/services/user.service';

import {
    BACK_BUTTON,
    BACK_TO_ADMIN_BUTTON,
    CHARACTERS_LIST_BUTTON,
    GRIMOIRES_BUTTON,
    MONEY_BUTTON,
    PERMITIONS_BUTTON,
} from '../../constants/button-names.constant';
import { ENUM_SCENES_ID } from '../../constants/scenes.id.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CharacterService } from 'src/modules/character/services/character.service';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { Paginated } from 'nestjs-paginate';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ENUM_ACTION_NAMES } from '../../constants/action-names.constant';
import { RaceService } from 'src/modules/race/race.service';
import { CharacteristicService } from 'src/modules/character/services/characteristics.service';
import { MapService } from 'src/modules/map/service/map.service';
@Scene(ENUM_SCENES_ID.ADMIN_CHARACTERS_SETTINGS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class CharactersSettingsScene {
    constructor(
        private readonly userService: UserService,
        private readonly characterService: CharacterService,
        private readonly raceService: RaceService,
        private readonly stateService: MapService,
        private readonly characteristicService: CharacteristicService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Меню редактирования персонажей';
        await ctx.sendPhoto(
            {
                source: ADMIN_IMAGE_PATH,
            },
            {
                caption,
                ...Markup.keyboard([
                    [PERMITIONS_BUTTON, GRIMOIRES_BUTTON],
                    [MONEY_BUTTON, CHARACTERS_LIST_BUTTON],
                    [BACK_TO_ADMIN_BUTTON],
                ]).resize(),
            }
        );
    }

    @Hears(BACK_TO_ADMIN_BUTTON)
    async backToMainAdmin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_SCENE_ID);
    }
    @Action(/^(CHARACTER_NEXT_PAGE.*)$/)
    async nextPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const data = ctx.callbackQuery['data'].split(':');
        const page = Number.parseInt(data[1]);
        const characters = await this.characterService.findAll({
            path: '',
            limit: 10,
            page: page,
        });
        const [caption, buttons] = charactersListButtons(characters);
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(CHARACTER_PREVIOUS_PAGE.*)$/)
    async previousPage(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const page = Number.parseInt(ctx.callbackQuery['data'].split(':')[1]);

        const characters = await this.characterService.findAll({
            path: '',
            limit: 10,
            page: page,
        });
        const [caption, buttons] = charactersListButtons(characters);
        await ctx.editMessageText(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^CHARACTER:(.*)$/)
    async characterInfo(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const characterId = await ctx.callbackQuery['data'].split(':')[1];
        ctx.session.characterIdForChangeRaceAndState = characterId;
        const character =
            await this.characterService.findCharacterById(characterId);
        let caption = 'Персонаж\n';
        caption += `${character.background.name}\n${character.background.race.name}\n${character.background.state.name}\n`;
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Изменить расу',
                        `${ENUM_ACTION_NAMES.CHANGE_RACE_ACTION}:${character.id}`
                    ),
                ],
                [
                    Markup.button.callback(
                        'Изменить страну',
                        `${ENUM_ACTION_NAMES.CHANGE_STATE_ACTION}:${character.id}`
                    ),
                ],
            ]),
        });
    }
    @Action(/^CHANGE_RACE_ACTION:(.*)$/)
    async changeRace(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const character = await this.characterService.findCharacterById(
            ctx.session.characterIdForChangeRaceAndState
        );
        const races = await this.raceService.findAll({
            path: '',
        });
        const caption = 'Расы';
        const buttons = [];
        races.data.map((race) => {
            buttons.push([
                Markup.button.callback(race.name, `RACE_CHANGE_ID:${race.id}:`),
            ]);
        });
        await ctx.reply(caption, {
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^RACE_CHANGE_ID:(.*)$/)
    async changeRace1(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const race = await ctx.callbackQuery['data'].split(':')[1];
        await this.characteristicService.changeRace({
            characterId: ctx.session.characterIdForChangeRaceAndState,
            raceId: race,
        });
        const character = await this.characterService.findCharacterById(
            ctx.session.characterIdForChangeRaceAndState
        );
        ctx.session.characterIdForChangeRaceAndState = null;
        let caption = 'Персонаж\n';
        caption += `${character.background.name}\n${character.background.race.name}\n${character.background.state.name}\n`;

        await ctx.reply(caption);
    }

    @Action(/^CHANGE_STATE_ACTION:(.*)$/)
    async changeState(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const character = await this.characterService.findCharacterById(
            ctx.session.characterIdForChangeRaceAndState
        );
        const races = await this.stateService.findAllStates({
            path: '',
        });
        const caption = 'Страны';
        const buttons = [];
        races.data.map((race) => {
            buttons.push([
                Markup.button.callback(
                    race.name,
                    `STATE_CHANGE_ID:${race.id}:`
                ),
            ]);
        });
        await ctx.reply(caption, {
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^STATE_CHANGE_ID:(.*)$/)
    async changeState1(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const state = await ctx.callbackQuery['data'].split(':')[1];
        await this.characteristicService.changeState({
            characterId: ctx.session.characterIdForChangeRaceAndState,
            state: state,
        });
        const character = await this.characterService.findCharacterById(
            ctx.session.characterIdForChangeRaceAndState
        );
        ctx.session.characterIdForChangeRaceAndState = null;
        let caption = 'Персонаж\n';
        caption += `${character.background.name}\n${character.background.race.name}\n${character.background.state.name}\n`;

        await ctx.reply(caption);
    }
    @Action(ENUM_ACTION_NAMES.BACK_TO_CHARACTER)
    async backToGrimoireTower(@Ctx() ctx: BotContext, @Sender() sender) {
        /*   ctx.answerCbQuery();
      await ctx.deleteMessage();
      this.showEnterMessage(ctx, sender.id);*/
    }
    @Hears(PERMITIONS_BUTTON)
    async permitions(@Ctx() ctx: BotContext) {
        const superAdmins = await this.userService.findOwners();
        const admins = await this.userService.findAdmins();
        let caption = '<strong>Супер админ</strong>\n';
        superAdmins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        caption += '<strong>Список админов:</strong>\n';
        admins.map(
            (admin, index) => (caption += `${index + 1}) ${admin.tgUserId}\n`)
        );
        if (admins.length == 1) {
            caption += 'Админов нет';
        }
        await ctx.reply(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Назначить админа',
                        `ACTION_ADD_ADMIN`
                    ),
                    Markup.button.callback(
                        'Снять админа',
                        `ACTION_DELETE_ADMIN`
                    ),
                ],
            ]),
        });
    }

    @Hears(MONEY_BUTTON)
    async money(@Ctx() ctx: BotContext) {
        ctx.scene.enter(ENUM_SCENES_ID.ADMIN_MONEY_SCENE_ID);
    }

    @Hears(GRIMOIRES_BUTTON)
    async grimoire(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_GRIMOIRES_SCENE_ID);
    }


    @Action('ACTION_ADD_ADMIN')
    async addAdmin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.ADD_ADMIN_SCENE_ID);
    }

    @Action('ADD_NEW_DRAFT_ANNOUNCEMENT')
    async removeAdmin(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.DELETE_ADMIN_SCENE_ID);
    }

    @Hears(BACK_BUTTON)
    async home(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.HOME_SCENE_ID);
    }
}

export const charactersListButtons = (
    problems: Paginated<CharacterEntity>
): [string, InlineKeyboardButton[][]] => {
    const { data, meta } = problems;
    const { currentPage, totalPages, totalItems } = meta;
    let caption = `Судебные дела\n\n Общее количество дел: ${totalItems}`;
    const buttons: InlineKeyboardButton[][] = [];
    data.map((character, index) => {
        caption += `${index + 1})${character.background.name} ${character.user.tgUserId} ${character?.grimoire?.magicName ?? ''}\n`;
        buttons.push([
            Markup.button.callback(
                `${index + 1})${character.background.name} ${character.user.tgUserId} ${character?.grimoire?.magicName}\n`,
                `${ENUM_ACTION_NAMES.CHARACTER_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${character.id}${ENUM_ACTION_NAMES.DELIMITER}${ENUM_ACTION_NAMES.BACK_TO_CHARACTER}`
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
    } else if (currentPage == 1 && problems.meta.totalPages > 1) {
        buttons.push([
            Markup.button.callback(
                `${currentPage} из ${totalPages}`,
                ENUM_ACTION_NAMES.PAGE_ACTION
            ),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    } else if (currentPage == totalPages) {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(
                `${problems.meta.currentPage} из ${problems.meta.totalPages}`,
                `PAGE`
            ),
        ]);
    } else {
        buttons.push([
            Markup.button.callback(
                `<<`,
                `${ENUM_ACTION_NAMES.CHARACTER_PREVIOUS_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage - 1}`
            ),
            Markup.button.callback(`${currentPage} из ${totalPages}`, `PAGE`),
            Markup.button.callback(
                `>>`,
                `${ENUM_ACTION_NAMES.CHARACTER_NEXT_PAGE_ACTION}${ENUM_ACTION_NAMES.DELIMITER}${currentPage + 1}`
            ),
        ]);
    }
    return [caption, buttons];
};
