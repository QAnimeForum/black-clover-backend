import {
    Body,
    ConflictException,
    Controller,
    Get,
    Param,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';

import {
    ResponsePaging,
    Response,
} from 'src/common/response/decorators/response.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { RaceService } from './race.service';
import {
    RACE_DEFAULT_PER_PAGE,
    RACE_DEFAULT_ORDER_BY,
    RACE_DEFAULT_ORDER_DIRECTION,
    RACE_DEFAULT_AVAILABLE_SEARCH,
    RACE_DEFAULT_AVAILABLE_ORDER_BY,
} from './constants/race.list.constant';
import { CreateRaceDto } from './dto/create-race.dto';
import { RaceRequestDto } from './dto/race.request.dto';
import { RaceGetSerialization } from './serializations/race.get.serialization';
import { RaceListSerialization } from './serializations/race.list.serialization';
import { ENUM_RACE_STATUS_CODE_ERROR } from './constants/race.status-code.constant';
import { Paginate, Paginated } from 'nestjs-paginate';
import { RaceEntity } from './entity/race.entity';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/race',
})
export class RaceController {
    constructor(
        private readonly raceService: RaceService,
        private readonly paginationService: PaginationService
    ) {}
    @ResponsePaging('race.list', {
        serialization: RaceListSerialization,
    })
    @Get('/list')
    async findAllRaces(@Paginate() query): Promise<Paginated<RaceEntity>> {
        return await this.raceService.findAll(query);
    }

    @Response('race.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/create')
    async createRace(@Body() dto: CreateRaceDto): Promise<IResponse> {
        const exist: boolean = await this.raceService.raceExistByName(dto.name);
        if (!exist) {
            throw new ConflictException({
                statusCode: ENUM_RACE_STATUS_CODE_ERROR.RACE_EXIST_ERROR,
                message: 'character.race.error.exist',
            });
        }

        const create = await this.raceService.createrRace(dto);
        return {
            data: { _id: create.raw[0].id },
        };
    }

    @Response('race.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(RaceRequestDto)
    @Get('/get/:race')
    async getRace(@Param() params: RaceRequestDto): Promise<IResponse> {
        const race = await this.raceService.getRaceById(params.race);
        if (!race) {
            throw new ConflictException({
                statusCode: ENUM_RACE_STATUS_CODE_ERROR.RACE_EXIST_ERROR,
                message: 'character.race.error.exist',
            });
        }
        return {
            data: race,
        };
    }
}
