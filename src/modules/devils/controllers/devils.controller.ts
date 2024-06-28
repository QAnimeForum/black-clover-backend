import {
    ConflictException,
    Controller,
    Get,
    Post,
    Body,
    VERSION_NEUTRAL,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import { DevilsService } from '../services/devils.service';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { Response } from 'src/common/response/decorators/response.decorator';

import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_DEVIL_STATUS_CODE_ERROR } from '../constants/devil.status-code.constant';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { DevilGetSerialization } from '../serializations/devil.get.serialization';
import { DevilRequestDto } from '../dtos/devil.request.dto';
import { DevilUpdateNameDto } from '../dtos/devil.update-name.dto';
import { DevilUpdateDescriptionDto } from '../dtos/devil.update-description.dto';
import { DevilCreateDto } from '../dtos/devil.create.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DevilEntity } from '../entity/devil.entity';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/devils',
})
export class DevilsController {
    constructor(private readonly devilService: DevilsService) {}

    @Get()
    public findAll(
        @Paginate() query: PaginateQuery
    ): Promise<Paginated<DevilEntity>> {
        return this.devilService.findAll(query);
    }
    /*
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
            ENUM_DEVIL_RANK
        )
        rank: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'floor',
            DEVIL_FLOOR_DEFAULT_TYPE,
            ENUM_DEVIL_FLOOR
        )
        floor: Record<string, any>
    ): Promise<IResponsePaging> {
        console.log(dto);
        const [states, total] = await this.devilService.findAllDevils(
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
    }*/

    @Response('devil.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/create')
    async create(
        @Body()
        dto: DevilCreateDto
    ): Promise<IResponse> {
        const exist: boolean = await this.devilService.existByName(dto.name);
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_DEVIL_STATUS_CODE_ERROR.DEVIL_EXIST_ERROR,
                message: 'devil.error.exist',
            });
        }

        const create = await this.devilService.createDevil(dto);

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
        const devil = await this.devilService.findDevilById(params.devil);
        if (!devil) {
            throw new ConflictException({
                statusCode: ENUM_DEVIL_STATUS_CODE_ERROR.DEVIL_EXIST_ERROR,
                message: 'devil.error.exist',
            });
        }
        return {
            data: devil,
        };
    }

    @Response('devil.get', {
        serialization: DevilGetSerialization,
    })
    @RequestParamGuard(DevilRequestDto)
    @Get('/get/unions/:devil')
    async getUnions(@Param() params: DevilRequestDto): Promise<IResponse> {
        const devil = await this.devilService.findDevilById(params.devil);
        if (!devil) {
            throw new ConflictException({
                statusCode: ENUM_DEVIL_STATUS_CODE_ERROR.DEVIL_EXIST_ERROR,
                message: 'devil.error.exist',
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
        await this.devilService.deleteDevil(params.devil);
        return;
    }

    @Response('devil.update', {
        serialization: ResponseIdSerialization,
    })
    @RequestParamGuard(DevilRequestDto)
    @Put('/update/name/:devil')
    async updateDevilName(
        @Param('devil') devil: string,
        @Body() dto: DevilUpdateNameDto
    ): Promise<IResponse> {
        await this.devilService.updateDevilName(devil, dto);
        return {
            data: { _id: devil },
        };
    }

    @Response('devil.update', {
        serialization: ResponseIdSerialization,
    })
    @RequestParamGuard(DevilRequestDto)
    @Put('/update/description/:devil')
    async updateDevilDescription(
        @Param('devil') devil: string,
        @Body() dto: DevilUpdateDescriptionDto
    ): Promise<IResponse> {
        await this.devilService.updateDevilDescription(devil, dto);
        return {
            data: { _id: devil },
        };
    }
}
