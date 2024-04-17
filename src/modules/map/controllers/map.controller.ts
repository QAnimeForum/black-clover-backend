import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { MapService } from '../service/map.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    STATES_DEFAULT_PER_PAGE,
    STATES_DEFAULT_ORDER_BY,
    STATES_DEFAULT_ORDER_DIRECTION,
    STATES_DEFAULT_AVAILABLE_SEARCH,
    STATES_DEFAULT_AVAILABLE_ORDER_BY,
    PROVINCES_DEFAULT_PER_PAGE,
    PROVINCES_DEFAULT_ORDER_BY,
    PROVINCES_DEFAULT_ORDER_DIRECTION,
    PROVINCES_DEFAULT_AVAILABLE_SEARCH,
    PROVINCES_DEFAULT_AVAILABLE_ORDER_BY,
    BURGS_DEFAULT_PER_PAGE,
    BURGS_DEFAULT_ORDER_BY,
    BURGS_DEFAULT_ORDER_DIRECTION,
    BURGS_DEFAULT_AVAILABLE_SEARCH,
    BURGS_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/map-list.constant';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { StateListSerialization } from '../serialization/state.list.serialization';
import { BurgListSerialization } from '../serialization/burg.list.serialization';
import { ProvinceListSerialization } from '../serialization/province.list.serialization';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/map',
})
export class MapController {
    constructor(
        private readonly mapService: MapService,
        private readonly paginationService: PaginationService
    ) {}

    @ResponsePaging('map.state.list', {
        serialization: StateListSerialization,
    })
    @Get('/states')
    async getAllStates(
        @PaginationQuery(
            STATES_DEFAULT_PER_PAGE,
            STATES_DEFAULT_ORDER_BY,
            STATES_DEFAULT_ORDER_DIRECTION,
            STATES_DEFAULT_AVAILABLE_SEARCH,
            STATES_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        //  console.log(dto._search['$or'][0].name);
        const [states, total] = await this.mapService.getAllStates(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @ResponsePaging('map.province.list', {
        serialization: ProvinceListSerialization,
    })
    @Get('/provinces')
    async getAllProvinces(
        @PaginationQuery(
            PROVINCES_DEFAULT_PER_PAGE,
            PROVINCES_DEFAULT_ORDER_BY,
            PROVINCES_DEFAULT_ORDER_DIRECTION,
            PROVINCES_DEFAULT_AVAILABLE_SEARCH,
            PROVINCES_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [provinces, total] = await this.mapService.getAllProvincies(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        console.log(totalPage);
        return {
            _pagination: { totalPage, total },
            data: provinces,
        };
    }

    @ResponsePaging('map.burg.list', {
        serialization: BurgListSerialization,
    })
    @Get('/burgs')
    async getAllBurgs(
        @PaginationQuery(
            BURGS_DEFAULT_PER_PAGE,
            BURGS_DEFAULT_ORDER_BY,
            BURGS_DEFAULT_ORDER_DIRECTION,
            BURGS_DEFAULT_AVAILABLE_SEARCH,
            BURGS_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ) {
        const [burgs, total] = await this.mapService.getAllBurgs(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: burgs,
        };
    }
}
