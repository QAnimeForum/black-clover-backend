import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { ENUM_DEVIL_RANK } from './devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from './devil.floor.enum';

export const DEVIL_DEFAULT_PER_PAGE = 20;
export const DEVIL_DEFAULT_ORDER_BY = 'floor';
export const DEVIL_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const DEVIL_DEFAULT_AVAILABLE_ORDER_BY = ['name', 'floor', 'rank'];
export const DEVIL_DEFAULT_AVAILABLE_SEARCH = ['name', 'floor', 'rank'];

export const DEVIL_RANK_DEFAULT_TYPE = Object.values(ENUM_DEVIL_RANK);
export const DEVIL_FLOOR_DEFAULT_TYPE = Object.values(ENUM_DEVIL_FLOOR);
