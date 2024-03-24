import { IPaginationOptions } from 'src/common/pagination/interfaces/pagination.interface';
import { InfinityPaginationResultType } from './infinity-pagination-result.type';

export const infinityPagination = <T>(
    data: T[],
    options: IPaginationOptions
): InfinityPaginationResultType<T> => {
    return {
        data,
        hasNextPage: data.length === options.limit,
    };
};
