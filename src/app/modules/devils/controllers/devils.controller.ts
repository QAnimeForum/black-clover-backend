import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { DevilsService } from '../services/devils.service';
import { AllDevilsDto } from '../dtos/query.devil.dto';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/utils/RequestPaginationSerialization';

export const DEVILS_DEFAULT_PER_PAGE = 20;
export const DEVILS_DEFAULT_ORDER_BY = 'floor';
export const DEVILS_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const DEVILS_DEFAULT_AVAILABLE_ORDER_BY = ['name', 'floor', 'rank'];
export const DEVILS_DEFAULT_AVAILABLE_SEARCH = ['name', 'floor', 'rank'];

@Controller({
    version: VERSION_NEUTRAL,
    path: '/devils',
})
export class DevilsController {
    constructor(private readonly devilService: DevilsService) {}
    @Get('/list')
    @HttpCode(HttpStatus.OK)
    async list() {
        return this.devilService.findAll();
        /**
        *  const { devils, total } =
            await this.devilService.findByPagination(paginationDto);

        // const total: number = await this.devilService.getTotal(paginationDto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            paginationDto._limit
        );

        return {
            _pagination: { total, totalPage },
            data: devils,
        };
        */
    }

    /**
 *       @PaginationQueryFilterInEnum('rank', DEVIL_DEFAULT_RANK, DevilRanksEnum)
        rank: Record<string, any>,
        @PaginationQueryFilterInEnum('rank', DEVIL_DEFAULT_RANK, DevilRanksEnum)
        floor: Record<string, any>
 */

    /* async list(
        @Query() query: QueryDevilDto
    ): Promise<InfinityPaginationResultType<Devil>> {
    }*/
}
