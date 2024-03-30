import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const STATES_DEFAULT_PER_PAGE = 20;
export const STATES_DEFAULT_ORDER_BY = 'name';
export const STATES_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const STATES_DEFAULT_AVAILABLE_ORDER_BY = ['name'];
export const STATES_DEFAULT_AVAILABLE_SEARCH = ['name'];


export const PROVINCES_DEFAULT_PER_PAGE = 20;
export const PROVINCES_DEFAULT_ORDER_BY = 'shortName';
export const PROVINCES_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const PROVINCES_DEFAULT_AVAILABLE_ORDER_BY = ['shortName', 'fullName'];
export const PROVINCES_DEFAULT_AVAILABLE_SEARCH = ['shortName', 'fullName'];

export const BURGS_DEFAULT_PER_PAGE = 20;
export const BURGS_DEFAULT_ORDER_BY = 'name';
export const BURGS_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const BURGS_DEFAULT_AVAILABLE_ORDER_BY = ['name'];
export const BURGS_DEFAULT_AVAILABLE_SEARCH = ['name'];
