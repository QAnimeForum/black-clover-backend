import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { MapService } from '../service/map.service';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/map',
})
export class MapController {
    constructor(private readonly mapService: MapService) {}

    /** @PaginationQuery(
            COUNTRIES_DEFAULT_PER_PAGE,
            COUNTRIES_DEFAULT_ORDER_BY,
            COUNTRIES_DEFAULT_ORDER_DIRECTION,
            COUNTRIES_DEFAULT_AVAILABLE_SEARCH,
            COUNTRIES_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto */
    @Get('/countries')
    async getAllCountries() {
        //   console.log(_search, _limit, _offset, _order);
        const countries = await this.mapService.getAllCountries();
        return countries;
    }

    @Get('/provinces')
    async getAllProvinces() {
        const provinces = this.mapService.getAllProvincies();
        return {
            data: {
                provinces: provinces,
            },
        };
    }

    @Get('/burgs')
    async getAllBurgs() {
        const burgs = this.mapService.getAllBurgs();
        return {
            data: {
                burgs: burgs,
            },
        };
    }
}
