export enum ENUM_ACTION_NAMES {
    DELIMITER = ':',
    CHANGE_CAP = 'CHANGE_CAP',
    CHANGE_ARMOR = 'CHANGE_ARMOR',
    CHANGE_LEFT_HAND = 'CHANGE_LEFT_HAND',
    CHANGE_RIGHT_HAND = 'CHANGE_RIGHT_HAND',
    CHANGE_CLOAK_ACTION = 'CHANGE_CLOAK_ACTION',
    CHANGE_GLOVES_ACTION = 'CHANGE_GLOVES_ACTION',
    CHANGE_FEET_ACTION = 'CHANGE_FEET_ACTION',
    CHANGE_ACCESSORY_ACTION = 'CHANGE_ACCESSORY_ACTION',
    CHANGE_VEHICLE_ACTION = 'CHANGE_VEHICLE_ACTION',

    ITEMS_SETTINGS_ACTION = 'ITEMS_SETTINGS_ACTION',
    EQUIPMENT_ITEM_ACTIONS = 'EQUIPMENT_ITEM_ACTIONS',
    EQUIPMENT_ITEM_LIST_ACTION = 'EQUIPMENT_ITEM_LIST_ACTION',
    CREATE_EQUIPMENT_ITEM_ACTION = 'CREATE_EQUIPMENT_ITEM_ACTION',
    GIVE_EQUIPMENT_ITEM_TO_USER_ACTION = 'GIVE_EQUIPMENT_ITEM_TO_USER_ACTION',

    RESTAURANTS_ACTIONS = 'RESTAURANTS_ACTIONS',
    DRINK_ACTIONS = 'DRINK_ACTIONS',
    DRINK_LIST_ACTION = 'DRINK_LIST_ACTION',
    CREATE_DRINK_ACTION = 'CREATE_DRINK_ACTION',
    GIVE_DRINK_TO_USER_ACTION = 'GIVE_DRINK_TO_USER_ACTION',
    EDIT_DRINK_PHOTO_ACTION = 'EDIT_DRINK_PHOTO',
    EDIT_DRINK_DESCRIPTION_ACTION = 'EDIT_DRINK_DESCRIPTION',
    EDIT_DRINK_NAME_ACTION = 'EDIT_DRINK_NAME',
    DELETE_DRINK_ACTION = 'DELETE_DRINK_ACTION',

    FOOD_ACTIONS = 'FOOD_ACTIONS',
    FOOD_LIST_ACTION = 'FOOD_LIST_ACTION',
    CREATE_FOOD_ACTION = 'CREATE_FOOD_ACTION',
    GIVE_FOOD_TO_USER_ACTION = 'GIVE_FOOD_TO_USER_ACTION',

    RESOURCES_ACTIONS = 'RESOURCES_ACTIONS',
    RESOURCES_LIST_ACTION = 'RESOURCES_LIST_ACTION',
    CREATE_RESOURCES_ACTION = 'CREATE_RESOURCES_ACTION',
    GIVE_RESOURCES_TO_USER_ACTION = 'GIVE_RESOURCES_TO_USER_ACTION',

    CREATE_OFFER_ACTION = 'CREATE_OFFER_ACTION',
    DELETE_OFFER_ACTION = 'DELETE_OFFER_ACTION',

  /*  ITEM_LIST_ACTION = 'ITEM_ACTION',
    CREATE_ITEM_ACTION = 'CREATE_ITEM_ACTION',
    GIVE_ITEM_TO_USER_ACTION = 'GIVE_ITEM_TO_USER_ACTION',
   
    CREATE_ITEM_ACTION = 'CREATE_ITEM_ACTION',
    GIVE_ITEM_TO_USER_ACTION = 'GIVE_ITEM_TO_USER_ACTION',
    CREATE_OFFER_ACTION = 'CREATE_OFFER_ACTION',
    DELETE_OFFER_ACTION = 'DELETE_OFFER_ACTION',*/
    //SHOPPING_DISTRICT_PAGE
    SHOP_ACTION = 'SHOP_ACTION',

    SHOP_NEXT_PAGE_ACTION = 'SHOP_NEXT_PAGE',
    SHOP_PREVIOUS_PAGE_ACTION = 'SHOP_PREVIOUS_PAGE',

    BLACK_MARKET_ACTION = 'BLACK_MARKET_ACTION',
    CHECK_OFFERS_ACTION = 'CHECK_OFFERS_ACTION',
    ITEMS_NEXT_PAGE_ACTION = 'ITEMS_NEXT_PAGE_ACTION',
    ITEMS_PREVIOUS_ACTION = 'ITEMS_PREVIOUS_ACTION',
    CREATE_MARKET_OFFER_ACTION = 'CREATE_MARKET_OFFER_ACTION',
    SEARCH_OFFERS_BY_NAME_ACTION = 'SEARCH_OFFERS_BY_NAME_ACTION',
    SEARCH_OFFERS_BY_CATEGORY_ACTION = 'SEARCH_OFFERS_BY_CATEGORY_ACTION',
    MY_OFFERS_ACTION = 'MY_OFFERS_ACTION',
    BAR_ACTION = 'BAR_ACTION',
    CASINO_ACTION = 'CASINO_ACTION',
    //back buttons

    BACK_TO_EQUIP_ITEM = 'back_to_equip_item',
    BACK_TO_GRIMOIRE_TOWER_ACTION = 'BACK_TO_GRIMOIRE_TOWER_ACTION',
    BACK_TO_GRIMOIRE_OFFICE_ACTION = 'BACK_TO_GRIMOIRE_OFFICE_ACTION',
    BACK_TO_GRIMOIRE_LIST_ACTION = 'BACK_TO_GRIMOIRE_LIST_ACTION',
    BACK_TO_PROFILE_ACTION = 'BACK_TO_PROFILE_ACTION',
    BACK_TO_ORGANIZATIONS_ACTION = 'BACK_TO_ORGANIZATIONS_ACTION',
    BACK_TO_SHOPPING_DISTRICT_ACTION = 'BACK_TO_SHOPPING_DISTRICT_ACTION',
    BACK_TO_BACKGROUND_ACTION = 'BACK_TO_BACKGROUND_ACTION',

    BACK_TO_ALL_PROBLEMS = 'ALL_PROBLEMS',
    BACK_TO_CHARACTER = 'BACK_TO_CHARACTER',
    BACK_TO_MY_PROBLEMS = 'MY_PROBLEMS',
    BACK_TO_WORK_PROBLEMS = 'WORK_PROBLEMS',
    BACK_TO_PARLAMENT_OFFICE = 'BACK_TO_PARLAMENT_OFFICE',
    //
    PAGE_ACTION = 'PAGE_ACTION',
    //parlament
    PROBLEM_ACTION = 'PROBLEM_',
    PROBLEMS_NEXT_PAGE_ACTION = 'PROBLEMS_NEXT_PAGE',
    PROBLEMS_PREVIOUS_ACTION = 'PROBLEMS_PREVIOUS_PAGE',
    ADD_PROBLEM_TO_WORK_ACTION = 'ADD_PROBLEM_TO_WORK',
    REMOVE_PROBLEM_TO_WORK_ACTION = 'REMOVE_PROBLEM_TO_WORK',
    //grimoire
    CHARACTER_ACTION = 'CHARACTER',
    CHARACTER_NEXT_PAGE_ACTION = 'CHARACTER_NEXT_PAGE',
    CHARACTER_PREVIOUS_ACTION = 'CHARACTER_PREVIOUS_PAGE',
    CHANGE_RACE_ACTION = 'CHANGE_RACE_ACTION',
    CHANGE_STATE_ACTION = 'CHANGE_STATE_ACTION',

    GRIMOIRE_STATISTIC_ACTION = 'GRIMOIRE_STATISTIC_ACTION',
    GRIMOIRE_LIST_ACTION = 'GRIMOIRE_LIST_ACTION',
    GET_GRIMOIRE_ACTION = 'GET_GRIMOIRE_ACTION',
    GRIMOIRE_INFO_ACTION = 'GRIMOIRE_INFO',
    GRIMOIRES_NEXT_PAGE_ACTION = 'GRIMOIRES_NEXT_PAGE',
    GRIMOIRES_PREVIOUS_PAGE_ACTION = 'GRIMOIRES_PREVIOUS_PAGE',

    GRIMOIRES_TO_WORK_NEXT_PAGE_ACTION = 'GRIMOIRES_TO_WORK_NEXT',
    GRIMOIRES_TO_WORK_PREVIOUS_PAGE_ACTION = 'GRIMOIRES_TO_WORK_PREVIOUS',

    ADD_TOWER_WORKERS_ACTION = 'ADD_TOWER_WORKERS_ACTION',
    REMOVE_TOWER_WORKERS_ACTION = 'REMOVE_TOWER_WORKERS_ACTION',
    ADD_GRIMOIRE_TO_WORK_ACTION = 'ADD_GRIMOIRE_TO_WORK',
    REMOVE_GRIMOIRE_TO_WORK_ACTION = 'REMOVE_GRIMOIRE_TO_WORK',

    GET_MY_GRIMOIRE_ACTION = 'GET_MY_GRIMOIRE_ACTION',
    GET_MY_BACKGROUND_ACTION = 'GET_MY_BACKGROUND_ACTION',
    SHOW_APPEARANCE_ACTION = 'SHOW_APPEARANCE_ACTION',
    SHOW_TRAITS_ACTION = 'SHOW_TRAITS_ ACTION',
    SHOW_HISTORY_ACTION = 'SHOW_HISTORY_ACTION',
    SHOW_HOBBIES_ACTION = 'SHOW_HOBBIES_ACTION',
    SHOW_GOALS_ACTION = 'SHOW_GOALS_ACTION',
    SHOW_WORLDVIEW_ACTION = 'SHOW_WORLDVIEW_ACTION',
    SHOW_IDEALS_ACTION = 'SHOW_IDEALS_ACTION',
    SHOW_WEAKNESSS_ACTION = 'SHOW_WEAKNESS_ACTION',
    SHOW_QUOTES_ACTION = 'SHOW_QUOTES_ACTION',
    SHOW_ATTACHMENTS_ACTION = 'SHOW_ATTACHMENTS_ACTION',

    SHOW_ALL_BACKGROUND_ACTION = 'SHOW_ALL_BACKGROUND_ACTION',

    ADD_JUDICIAL_OFFICER_ACTION = 'ADD_JUDICIAL_OFFICER_ACTION',
    REMOVE_JUDICIAL_OFFICER_ACTION = 'REMOVE_JUDICIAL_OFFICER_ACTION',
    WORKER_PROBLEMS = 'WORKER_PROBLEMS',
    PROBLEM_WORK = 'PROBLEM_WORK',
    CREATE_SOLVE_ACTION = 'CREATE_SOLVE_ACTION',

    GET_MY_INVENTORY_ACTION = 'GET_MY_INVENTORY_ACTION',
    GET_MY_WALLET_ACTION = 'GET_MY_WALLET_ACTION',
    CONVERT_TO_COPPER_ACTION = 'CONVERT_TO_COPPER_ACTION',
    CONVERT_TO_SILVER_ACTION = 'CONVERT_TO_SILVER_ACTION',
    CONVERT_TO_ELECTRUM_ACTION = 'CONVERT_TO_ELECTRUM_ACTION',
    CONVERT_TO_GOLD_ACTION = 'CONVERT_TO_GOLD_ACTION',
    CONVERT_TO_PLATINUM_ACTION = 'CONVERT_TO_PLATINUM_ACTION',
    GO_TO_GRIMOIRE_TOWER_ACTION = 'GO_TO_GRIMOIRE_TOWER_ACTION',
    COME_UP_WITH_MAGICAL_ATTRIBUTE_ACTION = 'COME_UP_WITH_MAGICAL_ATTRIBUTE_ACTION',
    ADMIN_CREATE_GRIMOIRE_ACTION = 'ADMIN_CREATE_GRIMOIRE_ACTION',
    MY_GRIMOIRES_ACTION = 'MY_GRIMOIRES',
    GET_GRIMOIRE_TO_WORK_ACTION = 'ADD_GRIMOIRE',
    EDIT_GRIMOIRE_COVER_BUTTON = 'EDIT_GRIMOIRE_COVER_BUTTON',
}
///^buy_plant_for_(money|rm)_(\d+)_(\d+)$/
export const GRIMOIRE_INFO_REGEX = /^GRIMOIRE_INFO:(.*)$/;
export const GRIMOIRE_NEXT_PAGE_REGEX = /^(GRIMOIRES_NEXT_PAGE.*)$/;
export const GRIMOIRE_PREVIOUS_PAGE_REGEX = /^(GRIMOIRES_PREVIOUS_PAGE.*)$/;
export const BACK_TO_GRIMOIRE_LIST_REQEX = /^(BACK_TO_GRIMOIRE_LIST_ACTION.*)$/;

export const PROBLEMS_NEXT_PAGE_REGEX = /^(PROBLEMS_NEXT_PAGE.*)$/;
export const PROBLEMS_PREVIOUS_PAGE_REGEX = /^(PROBLEMS_PREVIOUS_PAGE.*)$/;
