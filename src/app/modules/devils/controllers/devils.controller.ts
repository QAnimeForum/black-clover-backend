import {
    ConflictException,
    Controller,
    Get,
    Post,
    Body,
    VERSION_NEUTRAL,
    Param,
    Delete,
} from '@nestjs/common';
import { DevilsService } from '../services/devils.service';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    ResponsePaging,
    Response,
} from 'src/common/response/decorators/response.decorator';
import { DevilListSerialization } from '../serializations/devil.list.serialization';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    PaginationQuery,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';

import { CreateDevilDto } from '../dtos/devil.create.dto';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_DEVIL_STATUS_CODE_ERROR } from '../constants/devil.status-code.constant';
import { DevilRanksEnum } from '../constants/devil.ranks.enum';
import { DevilFloorEnum } from '../constants/devil.floor.enum';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { DevilGetSerialization } from '../serializations/devil.get.serialization';
import { DevilRequestDto } from '../dtos/devil.request.dto';
import {
    DEVIL_DEFAULT_AVAILABLE_ORDER_BY,
    DEVIL_DEFAULT_AVAILABLE_SEARCH,
    DEVIL_DEFAULT_ORDER_BY,
    DEVIL_DEFAULT_ORDER_DIRECTION,
    DEVIL_DEFAULT_PER_PAGE,
    DEVIL_FLOOR_DEFAULT_TYPE,
    DEVIL_RANK_DEFAULT_TYPE,
} from '../constants/devil.list.constant';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/devils',
})
export class DevilsController {
    constructor(
        private readonly devilService: DevilsService,
        private readonly paginationService: PaginationService
    ) {}

    @ResponsePaging('devil.list', {
        serialization: DevilListSerialization,
    })
    @Get('/list')
    async getAllStates(
        @PaginationQuery(
            DEVIL_DEFAULT_PER_PAGE,
            DEVIL_DEFAULT_ORDER_BY,
            DEVIL_DEFAULT_ORDER_DIRECTION,
            DEVIL_DEFAULT_AVAILABLE_SEARCH,
            DEVIL_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto,
        @PaginationQueryFilterInEnum(
            'rank',
            DEVIL_RANK_DEFAULT_TYPE,
            DevilRanksEnum
        )
        rank: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'floor',
            DEVIL_FLOOR_DEFAULT_TYPE,
            DevilFloorEnum
        )
        floor: Record<string, any>
    ): Promise<IResponsePaging> {
        const [states, total] = await this.devilService.getDevils(
            dto,
            rank,
            floor
        );
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @Response('devil.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/create')
    async create(
        @Body()
        dto: CreateDevilDto
    ): Promise<IResponse> {
        const exist: boolean = await this.devilService.existByName(dto.name);
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_DEVIL_STATUS_CODE_ERROR.DEVIL_EXIST_ERROR,
                message: 'devil.error.exist',
            });
        }

        const create = await this.devilService.create(dto);

        return {
            data: { _id: create.raw[0].id },
        };
    }

    @Response('devil.get', {
        serialization: DevilGetSerialization,
    })
    @RequestParamGuard(DevilRequestDto)
    @Get('/get/:devil')
    async getOne(@Param() params: DevilRequestDto): Promise<IResponse> {
        const devil = await this.devilService.findOne(params.devil);
        if (!devil) {
            throw new ConflictException({
                statusCode: ENUM_DEVIL_STATUS_CODE_ERROR.DEVIL_EXIST_ERROR,
                message: 'character.race.error.exist',
            });
        }
        return {
            data: devil,
        };
    }

    @Response('devil.delete')
    @RequestParamGuard(DevilRequestDto)
    @Delete('/delete/:devil')
    async delete(@Param() params: DevilRequestDto): Promise<void> {
        await this.devilService.remove(params.devil);
        return;
    }
}
