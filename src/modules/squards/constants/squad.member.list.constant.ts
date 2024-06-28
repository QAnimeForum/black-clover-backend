import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const SQUAD_MEMBER_DEFAULT_PER_PAGE = 20;
export const SQUAD_MEMBER_DEFAULT_ORDER_BY = 'floor';
export const SQUAD_MEMBER_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const SQUAD_MEMBER_DEFAULT_AVAILABLE_ORDER_BY = [
    'name',
    'floor',
    'rank',
];
export const SQUAD_MEMBER_DEFAULT_AVAILABLE_SEARCH = ['name', 'floor', 'rank'];
