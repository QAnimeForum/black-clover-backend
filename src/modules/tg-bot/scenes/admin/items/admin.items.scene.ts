import { Ctx, Scene, SceneEnter, Hears, Action, Sender } from 'nestjs-telegraf';

import { Inject, Logger, UseFilters } from '@nestjs/common';
import { Markup } from 'telegraf';
import { UserService } from 'src/modules/user/services/user.service';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AnnouncementService } from 'src/modules/events/services/announcement.service';
import { ShopService } from 'src/modules/items/service/shop.service';
import { EqupmentItemService } from 'src/modules/items/service/equipment.item.service';
import {
    ITEMS_BUTTON,
    BACK_BUTTON,
    SHOP_SETTINGS_BUTTON,
    EQUIPMENT_BUTTON,
    GOODS_BY_CATEOGORY_BUTTON,
    GOODS_BY_RARITY_BUTTON,
    EDIT_DRINK_NAME_BUTTON,
    EDIT_DRINK_DESCRIPTION_BUTTON,
    DELETE_DRINK_BUTTON,
    EDIT_DRINK_PHOTO_BUTTON,
    MENU_BUTTON,
    RECIPIES_BUTTON,
    SELL_INGREDIENTS_BUTTON,
    ADD_DRINK_TO_MENU_BUTTON,
} from 'src/modules/tg-bot/constants/button-names.constant';
import {
    ADMIN_IMAGE_PATH,
    BAR_IMAGE_PATH,
    SHOP_IMAGE_PATH,
} from 'src/modules/tg-bot/constants/images';
import { ENUM_SCENES_ID } from 'src/modules/tg-bot/constants/scenes.id.enum';
import { TelegrafExceptionFilter } from 'src/modules/tg-bot/filters/tg-bot.filter';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { ENUM_ACTION_NAMES } from 'src/modules/tg-bot/constants/action-names.constant';
import {
    itemInformation,
    rarityByttons,
    parentCategoriesButtons,
    childrenCategoriesButtons,
} from 'src/modules/tg-bot/utils/items.utils';
import fs from 'fs';
import { DrinkService } from 'src/modules/cuisine/service/drink.service';
import { PaginateQuery } from 'nestjs-paginate';
import { MenuService } from 'src/modules/cuisine/service/menu.service';
@Scene(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID)
@UseFilters(TelegrafExceptionFilter)
export class AdminItemsScene {
    constructor(
        private readonly userService: UserService,
        private readonly equipmentItemService: EqupmentItemService,
        private readonly announcementService: AnnouncementService,
        private readonly shopService: ShopService,
        private readonly drinkService: DrinkService,
        private readonly menuService: MenuService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}
    @SceneEnter()
    async enter(@Ctx() ctx: BotContext) {
        const caption = 'Админская панель для админов';
        if (ctx.session.adminDrinkIdForEdit) {
            const drink = await this.drinkService.findDrinkById(
                ctx.session.adminDrinkIdForEdit
            );
            let caption = 'Напиток "';
            caption += drink.name + '"\n\n';
            caption += '<strong>Описание</strong>\n';
            caption += drink.description;
            const buttons = [];
            buttons.push([
                Markup.button.callback(
                    EDIT_DRINK_PHOTO_BUTTON,
                    `${ENUM_ACTION_NAMES.EDIT_DRINK_PHOTO_ACTION}:${drink.id}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    EDIT_DRINK_NAME_BUTTON,
                    `${ENUM_ACTION_NAMES.EDIT_DRINK_NAME_ACTION}:${drink.id}`
                ),
                Markup.button.callback(
                    EDIT_DRINK_DESCRIPTION_BUTTON,
                    `${ENUM_ACTION_NAMES.EDIT_DRINK_DESCRIPTION_ACTION}:${drink.name}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    DELETE_DRINK_BUTTON,
                    `${ENUM_ACTION_NAMES.DELETE_DRINK_ACTION}:${drink.id}`
                ),
            ]);
            buttons.push([
                Markup.button.callback(
                    BACK_BUTTON,
                    ENUM_ACTION_NAMES.DRINK_LIST_ACTION
                ),
            ]);
            const drinkImage = `${process.env.APP_API_URL}/Assets/images/drink/${drink.id}/${drink.imagePath}`;

            await ctx.replyWithPhoto(
                {
                    source:
                        fs.existsSync(drinkImage) &&
                        fs.lstatSync(drinkImage).isFile()
                            ? drinkImage
                            : SHOP_IMAGE_PATH,
                },
                {
                    caption,
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        } else {
            await ctx.sendPhoto(
                {
                    source: ADMIN_IMAGE_PATH,
                },
                {
                    caption,
                    ...Markup.keyboard([
                        [ITEMS_BUTTON, SHOP_SETTINGS_BUTTON],
                        [BACK_BUTTON],
                    ]).resize(),
                }
            );
        }
    }

    @Hears(ITEMS_BUTTON)
    async equipmentItemSettings(@Ctx() ctx: BotContext) {
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Настройки предметов',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Предметы экипировки',
                            ENUM_ACTION_NAMES.EQUIPMENT_ITEM_ACTIONS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Рестораны',
                            ENUM_ACTION_NAMES.RESTAURANTS_ACTIONS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Жидкости',
                            ENUM_ACTION_NAMES.DRINK_ACTIONS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Еда',
                            ENUM_ACTION_NAMES.FOOD_ACTIONS
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Ресурсы',
                            ENUM_ACTION_NAMES.RESOURCES_ACTIONS
                        ),
                    ],
                ]),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION)
    async equipmentItemSettingsAction(@Ctx() ctx: BotContext) {
        await ctx.editMessageCaption('Настройки предметов', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Предметы экипировки',
                        ENUM_ACTION_NAMES.EQUIPMENT_ITEM_ACTIONS
                    ),
                ],
                [
                    Markup.button.callback(
                        'Жидкости',
                        ENUM_ACTION_NAMES.DRINK_ACTIONS
                    ),
                ],
                [Markup.button.callback('Еда', ENUM_ACTION_NAMES.FOOD_ACTIONS)],
                [
                    Markup.button.callback(
                        'Ресурсы',
                        ENUM_ACTION_NAMES.RESOURCES_ACTIONS
                    ),
                ],
            ]),
        });
    }

    @Action(ENUM_ACTION_NAMES.EQUIPMENT_ITEM_ACTIONS)
    async itemSettings(@Ctx() ctx: BotContext) {
        await ctx.editMessageCaption('Настройки предметов экипиповки', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Список предметов',
                        ENUM_ACTION_NAMES.EQUIPMENT_ITEM_LIST_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Создать предмет',
                        ENUM_ACTION_NAMES.CREATE_EQUIPMENT_ITEM_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Выдать предмет пользователю',
                        ENUM_ACTION_NAMES.GIVE_EQUIPMENT_ITEM_TO_USER_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        BACK_BUTTON,
                        ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION
                    ),
                ],
            ]),
        });
    }

    @Hears(SHOP_SETTINGS_BUTTON)
    async shopSettings(@Ctx() ctx: BotContext) {
        await ctx.reply('Настройки магазина', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Создать предложение в магазине',
                        ENUM_ACTION_NAMES.CREATE_OFFER_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Удалить предложение в магазине',
                        ENUM_ACTION_NAMES.DELETE_OFFER_ACTION
                    ),
                ],
            ]),
        });
    }

    @Action(ENUM_ACTION_NAMES.EQUIPMENT_ITEM_LIST_ACTION)
    async itemListAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.editMessageCaption('Список товаров', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        GOODS_BY_CATEOGORY_BUTTON,
                        GOODS_BY_CATEOGORY_BUTTON
                    ),
                ],
                [
                    Markup.button.callback(
                        GOODS_BY_RARITY_BUTTON,
                        GOODS_BY_RARITY_BUTTON
                    ),
                ],
            ]),
        });
    }
    @Action(GOODS_BY_CATEOGORY_BUTTON)
    async goodsByCategory(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const categories = await this.equipmentItemService.findCategories();
        const buttons = parentCategoriesButtons(categories);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.EQUIPMENT_ITEM_ACTIONS
            ),
        ]);
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Выберите категорию товара',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(/^(CATEGORY_ID.*)$/)
    async category(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const categoryId = ctx.callbackQuery['data'].split(':')[1];
        if (categoryId == 'null') {
            const categories = await this.equipmentItemService.findCategories();
            const buttons = parentCategoriesButtons(categories);
            buttons.push([
                Markup.button.callback(BACK_BUTTON, EQUIPMENT_BUTTON),
            ]);
            await ctx.deleteMessage();
            await ctx.sendPhoto(
                {
                    source: SHOP_IMAGE_PATH,
                },
                {
                    caption: 'Выберите категорию товара',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        } else {
            const categories =
                await this.equipmentItemService.findCategoriesByRoot(
                    categoryId
                );
            const children = categories.children;
            let buttons = [];
            if (children.length > 0) {
                buttons = childrenCategoriesButtons(categories);
            } else {
                const items =
                    await this.equipmentItemService.findAllEquipmentItems({
                        path: '',
                        filter: {
                            categoryId: `$eq:${categories.id}`,
                        },
                    });
                for (let i = 0; i < items.data.length; ++i) {
                    buttons.push([
                        Markup.button.callback(
                            items.data[i].name,
                            `CATEGORY_ITEM_ID:${items.data[i].id}`
                        ),
                    ]);
                }
                buttons.push([
                    Markup.button.callback(
                        BACK_BUTTON,
                        `CATEGORY_ID:${categories.parentId}`
                    ),
                ]);
            }
            await ctx.deleteMessage();
            await ctx.sendPhoto(
                {
                    source: SHOP_IMAGE_PATH,
                },
                {
                    caption: 'Предметы',
                    ...Markup.inlineKeyboard(buttons),
                }
            );
        }
    }

    @Action(GOODS_BY_RARITY_BUTTON)
    async goodsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        const buttons = rarityByttons();
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.EQUIPMENT_ITEM_ACTIONS
            ),
        ]);
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Выберите редкость товара',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(/^(RARITY:.*)$/)
    async showItemsByRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const rarity = ctx.callbackQuery['data'].split(':')[1];
        const buttons = [];
        const items = await this.equipmentItemService.findAllEquipmentItems({
            path: '',
            filter: {
                rarity: `$eq:${rarity}`,
            },
        });
        for (let i = 0; i < items.data.length; ++i) {
            buttons.push([
                Markup.button.callback(
                    items.data[i].name,
                    `RARITY_ITEM_ID:${items.data[i].id}`
                ),
            ]);
        }
        buttons.push([
            Markup.button.callback(BACK_BUTTON, GOODS_BY_RARITY_BUTTON),
        ]);
        //   buttons.push([Markup.button.callback(BACK_BUTTON, `RARITY:${rarity}`)]);
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: SHOP_IMAGE_PATH,
            },
            {
                caption: 'Предметы',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(/^(RARITY_ITEM_ID:.*)$/)
    async rarityItem(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, itemId, isAdmin);
    }

    @Action(/^(CATEGORY_ITEM_ID.*)$/)
    async categoryItem(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, itemId, isAdmin);
    }

    async showItem(ctx: BotContext, itemId: string, isAdmin: boolean) {
        const item = await this.equipmentItemService.findItemById(itemId);
        const isItemHasOffer = await this.shopService.hasItemOffer(itemId);
        const [caption, buttons] = itemInformation(
            item,
            isAdmin,
            isItemHasOffer
        );
        await ctx.deleteMessage();
        const itemImage = `${process.env.APP_API_URL}/Assets/images/items/${itemId}/${item.image}`;

        await ctx.replyWithPhoto(
            {
                source:
                    fs.existsSync(itemImage) && fs.lstatSync(itemImage).isFile()
                        ? itemImage
                        : SHOP_IMAGE_PATH,
            },
            {
                caption: caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }
    @Action(ENUM_ACTION_NAMES.CREATE_EQUIPMENT_ITEM_ACTION)
    async createItemAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.ITEM_CREATE_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.GIVE_EQUIPMENT_ITEM_TO_USER_ACTION)
    async giveItemToUser(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.GIVE_ITEM_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.CREATE_OFFER_ACTION)
    async createOffer(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        await ctx.scene.enter(ENUM_SCENES_ID.CREATE_OFFER_SCENE_ID);
    }
    @Action(/^(EDIT_ITEM_NAME:.*)$/)
    async editItemName(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_NAME_ITEM_SCENE_ID);
    }
    @Action(/^(EDIT_ITEM_DESCRIPTION:.*)$/)
    async editItemDescription(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_DESCRIPTION_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_RARITY:.*)$/)
    async editItemRarity(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_RARITY_ITEM_SCENE_ID);
    }
    @Action(/^(EDIT_ITEM_SLOT:.*)$/)
    async editSlot(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_SLOT_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_PHOTO:.*)$/)
    async editPhoto(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_PHOTO_ITEM_SCENE_ID);
    }

    @Action(/^(EDIT_ITEM_CATEGORY:.*)$/)
    async editItemCategory(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();

        const itemId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.itemId = itemId;
        ctx.scene.enter(ENUM_SCENES_ID.EDIT_CATEGORY_ITEM_SCENE_ID);
    }
    @Action(/^(DELETE_OFFER_BUTTON.*)$/)
    async deleteOffer(@Ctx() ctx: BotContext, @Sender() sender) {
        await ctx.answerCbQuery();
        const itemId = ctx.callbackQuery['data'].split(':')[1];
        await this.shopService.makeOfferNotActive(itemId);
        const isAdmin = await this.userService.isAdmin(sender.id.toString());
        await this.showItem(ctx, ctx.session.itemId, isAdmin);
        await ctx.reply('Предложение отмечено как неактивное');
    }

    @Action(ENUM_ACTION_NAMES.RESTAURANTS_ACTIONS)
    async restaurantsAction(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const buttons = [];
        const menus = await this.menuService.findRestrantMenus({
            path: '',
        });
        menus.data.map((menu) => {
            buttons.push([
                Markup.button.callback(menu.name, `MENU:${menu.id}`),
            ]);
        });
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION
            ),
        ]);
        await ctx.editMessageCaption('Настройки ресторанов', {
            ...Markup.inlineKeyboard(buttons),
        });
    }
    @Action(/^(MENU:.*)$/)
    async bar(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedMenuId = ctx.callbackQuery['data'].split(':')[1];
        const bar = await this.menuService.findRestrantMenu(selectedMenuId);
        let caption = '<strong> ' + bar.name + '</strong>\n\n';
        caption += bar.description;
        const buttons = [];
        buttons.push([
            Markup.button.callback('Напитки', `MENU_DRINKS:${bar.id}`),
            Markup.button.callback('Еда', `MENU_FOOD:${bar.id}`),
        ]);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.RESTAURANTS_ACTIONS
            ),
        ]);
        await ctx.deleteMessage();
        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(/^(MENU_DRINKS:.*)$/)
    async menuDrink(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedMenuId = ctx.callbackQuery['data'].split(':')[1];
        const drinks = await this.menuService.findRestrantDrinks({
            path: '',
            filter: {
                'menu.id': selectedMenuId,
            },
        });
        console.log(drinks);
        const caption = '<strong>Напитки</strong>\n\n';
        const buttons = [];
        buttons.push([
            Markup.button.callback(
                ADD_DRINK_TO_MENU_BUTTON,
                `ADD_DRINK_TO_MENU:${selectedMenuId}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(BACK_BUTTON, `MENU:${selectedMenuId}`),
        ]);
        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(/^(ADD_DRINK_TO_MENU:.*)$/)
    async addDrinkToMenu(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedMenuId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminMenuId = selectedMenuId;
        await ctx.scene.enter(ENUM_SCENES_ID.DRINK_ADD_TO_MENU_SCENE_ID);
    }

    @Action(/^(MENU_FOOD:.*)$/)
    async menuFood(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const selectedMenuId = ctx.callbackQuery['data'].split(':')[1];
        const caption = '<strong>Еда</strong>\n\n';
        await ctx.sendPhoto(
            {
                source: BAR_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    Markup.button.callback(
                        BACK_BUTTON,
                        `MENU:${selectedMenuId}`
                    ),
                ]),
            }
        );
    }
    @Action(ENUM_ACTION_NAMES.DRINK_ACTIONS)
    async drinkSettings(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.editMessageCaption('Настройки напитков', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Список напитков',
                        ENUM_ACTION_NAMES.DRINK_LIST_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Создать напиток',
                        ENUM_ACTION_NAMES.CREATE_DRINK_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Выдать напиток пользователю',
                        ENUM_ACTION_NAMES.GIVE_DRINK_TO_USER_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        BACK_BUTTON,
                        ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION
                    ),
                ],
            ]),
        });
    }

    @Action(ENUM_ACTION_NAMES.DRINK_LIST_ACTION)
    async drinkList(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        ctx.session.adminDrinkIdForEdit = null;
        const query: PaginateQuery = {
            path: '',
            page: 1,
            limit: 10,
        };
        const drinks = await this.drinkService.findAllDrinks(query);
        const caption = 'Список напитков';
        const buttons = [];
        drinks.data.forEach((drink) => {
            buttons.push([
                Markup.button.callback(`${drink.name}`, `DRINK:${drink.id}`),
            ]);
        });
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.DRINK_ACTIONS
            ),
        ]);
        await ctx.editMessageCaption(caption, {
            ...Markup.inlineKeyboard(buttons),
        });
    }

    @Action(/^(DRINK.*)$/)
    async drink(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const drinkId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminDrinkIdForEdit = drinkId;
        const drink = await this.drinkService.findDrinkById(drinkId);
        let caption = 'Напиток "';
        caption += drink.name + '"\n\n';
        caption += '<strong>Описание</strong>\n';
        caption += drink.description;
        const buttons = [];
        buttons.push([
            Markup.button.callback(
                EDIT_DRINK_PHOTO_BUTTON,
                `${ENUM_ACTION_NAMES.EDIT_DRINK_PHOTO_ACTION}:${drink.id}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                EDIT_DRINK_NAME_BUTTON,
                `${ENUM_ACTION_NAMES.EDIT_DRINK_NAME_ACTION}:${drink.id}`
            ),
            Markup.button.callback(
                EDIT_DRINK_DESCRIPTION_BUTTON,
                `${ENUM_ACTION_NAMES.EDIT_DRINK_DESCRIPTION_ACTION}:${drink.name}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                DELETE_DRINK_BUTTON,
                `${ENUM_ACTION_NAMES.DELETE_DRINK_ACTION}:${drink.id}`
            ),
        ]);
        buttons.push([
            Markup.button.callback(
                BACK_BUTTON,
                ENUM_ACTION_NAMES.DRINK_LIST_ACTION
            ),
        ]);
        /**
  *        await ctx.editMessageCaption(caption, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(buttons),
        });
  */

        const drinkImage = `${process.env.APP_API_URL}/Assets/images/drink/${drink.id}/${drink.imagePath}`;
        await ctx.deleteMessage();
        await ctx.replyWithPhoto(
            {
                source:
                    fs.existsSync(drinkImage) &&
                    fs.lstatSync(drinkImage).isFile()
                        ? drinkImage
                        : SHOP_IMAGE_PATH,
            },
            {
                caption,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    @Action(ENUM_ACTION_NAMES.CREATE_DRINK_ACTION)
    async createDrink(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(ENUM_SCENES_ID.DRINK_CREATE_SCENE_ID);
    }

    @Action(ENUM_ACTION_NAMES.GIVE_DRINK_TO_USER_ACTION)
    async giveDrinkToUser(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(/^(EDIT_DRINK_PHOTO:.*)$/)
    async editDrinkPhoto(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const drinkId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminDrinkIdForEdit = drinkId;
        ctx.scene.enter(ENUM_SCENES_ID.DRINK_EDIT_PHOTO_SCENE_ID);
    }

    @Action(/^(EDIT_DRINK_NAME:.*)$/)
    async editDrinkName(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const drinkId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminDrinkIdForEdit = drinkId;
        ctx.scene.enter(ENUM_SCENES_ID.DRINK_EDIT_NAME_SCENE_ID);
    }

    @Action(/^(EDIT_DRINK_DESCRIPTION:.*)$/)
    async editDrinkDescription(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const drinkId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminDrinkIdForEdit = drinkId;
        ctx.scene.enter(ENUM_SCENES_ID.DRINK_EDIT_DESCRIPTION_SCENE_ID);
    }

    @Action(/^(DELETE_DRINK_ACTION:.*)$/)
    async deleteDrink(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        const drinkId = ctx.callbackQuery['data'].split(':')[1];
        ctx.session.adminDrinkIdForEdit = drinkId;
        ctx.scene.enter(ENUM_SCENES_ID.DRINK_DELETE_SCENE_ID);
    }
    @Action(ENUM_ACTION_NAMES.FOOD_ACTIONS)
    async foodSettings(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.editMessageCaption('Настройки напитков', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Список еды',
                        ENUM_ACTION_NAMES.FOOD_LIST_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Создать еду',
                        ENUM_ACTION_NAMES.CREATE_FOOD_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Выдать еду пользователю',
                        ENUM_ACTION_NAMES.GIVE_FOOD_TO_USER_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        BACK_BUTTON,
                        ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION
                    ),
                ],
            ]),
        });
    }

    @Action(ENUM_ACTION_NAMES.FOOD_LIST_ACTION)
    async foodList(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(ENUM_ACTION_NAMES.CREATE_FOOD_ACTION)
    async createFood(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(ENUM_ACTION_NAMES.GIVE_FOOD_TO_USER_ACTION)
    async giveFoodToUser(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(ENUM_ACTION_NAMES.RESOURCES_ACTIONS)
    async resourcesSettings(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
        await ctx.editMessageCaption('Настройки ресурсов', {
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        'Список ресурсов',
                        ENUM_ACTION_NAMES.RESOURCES_LIST_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Создать ресурс',
                        ENUM_ACTION_NAMES.CREATE_RESOURCES_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        'Выдать ресурсы пользователю',
                        ENUM_ACTION_NAMES.GIVE_RESOURCES_TO_USER_ACTION
                    ),
                ],
                [
                    Markup.button.callback(
                        BACK_BUTTON,
                        ENUM_ACTION_NAMES.ITEMS_SETTINGS_ACTION
                    ),
                ],
            ]),
        });
    }

    @Action(ENUM_ACTION_NAMES.RESOURCES_LIST_ACTION)
    async resourcesList(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(ENUM_ACTION_NAMES.CREATE_RESOURCES_ACTION)
    async createResources(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Action(ENUM_ACTION_NAMES.GIVE_RESOURCES_TO_USER_ACTION)
    async giveResourceToUser(@Ctx() ctx: BotContext) {
        await ctx.answerCbQuery();
    }

    @Hears(BACK_BUTTON)
    async back(@Ctx() ctx: BotContext) {
        ctx.session.adminDrinkIdForEdit = null;
        ctx.session.adminMenuId = null;
        await ctx.scene.enter(ENUM_SCENES_ID.ADMIN_ITEMS_SCENE_ID);
    }
}
