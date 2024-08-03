import { Inject, UseFilters } from '@nestjs/common';
import { maxLength } from 'class-validator';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
    Action,
    Context,
    Ctx,
    Hears,
    Scene,
    SceneEnter,
    Sender,
} from 'nestjs-telegraf';
import { CharacterService } from 'src/modules/character/services/character.service';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import {
    ADD_QUOTES_BUTTON,
    BACK_BUTTON,
    EDIT_APPEARANCE_BUTTON,
    EDIT_AVATAR_BUTTON,
    EDIT_BACKGROUND_BUTTON,
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
} from 'src/modules/tg-bot/constants/button-names.constant';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import {
    backgroundEditButtons,
    backgroundShowButtons,
    shortBackgroundToText,
    showFullBackgroundToText,
} from 'src/modules/tg-bot/utils/profile.utils';
import { Markup } from 'telegraf';
import { Logger } from 'winston';
import fs from 'fs';
@Scene(ENUM_SCENES_ID.BACKGROUND_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class BackgroundScene {
    constructor(
        private readonly characterService: CharacterService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Context() ctx: BotContext, @Sender() sender) {
        const type = ctx.chat.type;
        if (type == 'private') {
            const caption = 'Вы попали в свой кабинет и достали свои бумаги.';
            const senderId = sender.id;
            const avatarName =
                await this.characterService.findAvatarByTgId(senderId);
            const avatar = `${process.env.APP_API_URL}/${avatarName}`;
            await ctx.sendPhoto(
                {
                    source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.keyboard([
                        [SHOW_FULL_BACKGROUND_BUTTON, EDIT_BACKGROUND_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        } else {
            const senderId = sender.id;
            const username = sender.username;
            const avatar =
                await this.characterService.findAvatarByTgId(senderId);
            const background =
                await this.characterService.findBackgroundByTgId(senderId);

            const caption = shortBackgroundToText(
                background,
                username,
                senderId
            );
            const buttons = backgroundShowButtons();
            buttons.push([
                Markup.button.callback(
                    BACK_BUTTON,
                    ENUM_ACTION_NAMES.BACK_TO_PROFILE_ACTION
                ),
            ]);
            await ctx.sendPhoto(
                {
                    source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }

    @Hears(SHOW_FULL_BACKGROUND_BUTTON)
    async showFullInformation(@Ctx() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const caption = shortBackgroundToText(background, username, senderId);
        const buttons = backgroundShowButtons();
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_ALL_BACKGROUND_ACTION)
    async showAllBackground(@Ctx() ctx: BotContext, @Sender() sender) {
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);

        await showFullBackgroundToText(ctx, background, username, senderId);
    }

    @Action(ENUM_ACTION_NAMES.SHOW_APPEARANCE_ACTION)
    async showAppearance(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const appearance = `<strong>Описание внешности</strong>\n${background.appearance}\n`;

        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: appearance,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_TRAITS_ACTION)
    async showTraits(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const characterTraits = `<strong>Черты характера</strong>: ${background.characterTraits}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: characterTraits,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_HISTORY_ACTION)
    async showHistory(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const MAX_MESSAGE_LENGTH = 1000;

        let history = `<strong>Предыстория пероснажа</strong>\n`;
        let start = 1;
        let end = MAX_MESSAGE_LENGTH;
        history += background.history.slice(start, end);
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: history,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
        while (end <= background.history.length) {
            start = end + 1;
            end = end + MAX_MESSAGE_LENGTH;
            const caption = background.history.slice(start, end);
            await ctx.replyWithHTML(caption);
        }
    }

    @Action(ENUM_ACTION_NAMES.SHOW_HOBBIES_ACTION)
    async showHobbies(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const hobbies = `<strong>Хобби</strong>\n${background.hobbies}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: hobbies,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_GOALS_ACTION)
    async showGoals(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const goals = `<strong>Цели</strong>\n${background.goals}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },
            {
                caption: goals,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_WORLDVIEW_ACTION)
    async showWorldview(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const worldview = `<strong>Мировоззрение персонажа</strong>: ${background.worldview}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: worldview,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_IDEALS_ACTION)
    async showIdeals(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const ideals = `<strong>Идеалы</strong>\n${background.ideals}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: ideals,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_WEAKNESSS_ACTION)
    async showWeakness(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const weaknesses = `<strong>Слабости</strong>: ${background.weaknesses}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: weaknesses,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_QUOTES_ACTION)
    async showQuotes(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        let quotes = `<strong>Цитаты</strong>\n`;
        background.quotes.map((quote, index) => {
            quotes += `${index}) ${quote}\n`;
        });
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: quotes,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.SHOW_ATTACHMENTS_ACTION)
    async showAttachments(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const attachments = `<strong>Привязанности</strong>\n${background.attachments}\n`;
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },

            {
                caption: attachments,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            BACK_BUTTON,
                            ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.BACK_TO_BACKGROUND_ACTION)
    async backToBackGround(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const senderId = sender.id;
        const username = sender.username;
        const background =
            await this.characterService.findBackgroundByTgId(senderId);
        const caption = shortBackgroundToText(background, username, senderId);
        const buttons = backgroundShowButtons();
        const avatarName =
            await this.characterService.findAvatarByTgId(senderId);
        const avatar = `${process.env.APP_API_URL}/${avatarName}`;
        await ctx.sendPhoto(
            {
                source: fs.existsSync(avatar) ? avatar : KNIGHT_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Hears(EDIT_BACKGROUND_BUTTON)
    async editMenu(@Ctx() ctx: BotContext) {
        await ctx.reply('Меню редактирования персонажа', {
            ...Markup.inlineKeyboard(backgroundEditButtons()),
        });
    }

    @Action(EDIT_NAME_BUTTON)
    async editName(@Context() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_NAME_SCENE_ID);
    }

    @Action(EDIT_HISTORY_BUTTON)
    async editHistory(@Context() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_CHARACTER_HISTORY_SCENE_ID);
    }

    @Action(EDIT_AVATAR_BUTTON)
    async editAvatar(@Context() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_AVATAR_SCENE_ID);
    }
    @Action(EDIT_HOBBIES_BUTTON)
    async editHobbies(@Context() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_HOBBIES_SCENE_ID);
    }

    @Action(EDIT_GOALS_BUTTON)
    async editGoals(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_GOALS_SCENE_ID);
    }

    @Action(EDIT_WORLDVIEW_BUTTON)
    async editWorldview(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_WORLDVIEW_SCENE_ID);
    }

    @Action(EDIT_WEAKNESS_BUTTON)
    async editWeakness(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_WEAKNESS_SCENE_ID);
    }

    @Action(ADD_QUOTES_BUTTON)
    async addQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        //   await ctx.scene.enter(ENUM_SCENES_ID.ADD_QUOTES_SCENE_ID);
    }

    @Action(REMOVE_QUOTES_BUTTON)
    async removeQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        //    await ctx.scene.enter(ENUM_SCENES_ID.REMOVE_QUOTES_SCENE_ID);
    }

    @Action(EDIT_QUOTE_BUTTON)
    async editQuote(@Context() ctx: BotContext) {
        ctx.reply('В разработке');
        // await ctx.scene.enter(ENUM_SCENES_ID.EDIT_QUOTE_SCENE_ID);
    }

    @Action(EDIT_CHRACTER_TRAITS_BUTTON)
    async editTraits(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_CHRACTER_TRAITS_SCENE_ID);
    }

    @Action(EDIT_IDEALS_BUTTON)
    async editIdeals(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_IDEALS_SCENE_ID);
    }
    @Action(EDIT_APPEARANCE_BUTTON)
    async editAppearance(@Context() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.EDIT_APPEARANCE_SCENE_ID);
    }
    @Hears(BACK_BUTTON)
    async backButton(@Ctx() ctx: BotContext) {
        await ctx.scene.enter(ENUM_SCENES_ID.PROFILE_SCENE_ID);
    }
}
