import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryDevilDto } from '../dtos/query.devil.dto';
import { InfinityPaginationResultType } from 'src/utils/infinity-pagination-result.type';
import { Devil } from '../domain/devil';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { DevilsService } from '../services/devils.service';

@Controller('devils')
export class DevilsController {
    constructor(private readonly devilService: DevilsService) {}
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() query: QueryDevilDto
    ): Promise<InfinityPaginationResultType<Devil>> {
        const page = query?.page ?? 1;
        let limit = query?.limit ?? 10;
        if (limit > 50) {
            limit = 50;
        }

        return infinityPagination(
            await this.devilService.findManyWithPagination({
                filterOptions: query?.filters,
                sortOptions: query?.sort,
                paginationOptions: {
                    page,
                    limit,
                },
            }),
            { page, limit }
        );
    }
}
