import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { MapService } from '../service/map.service';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { StateListSerialization } from '../serialization/state.list.serialization';
import { BurgListSerialization } from '../serialization/burg.list.serialization';
import { ProvinceListSerialization } from '../serialization/province.list.serialization';
import { Paginate, Paginated } from 'nestjs-paginate';
import { StateEntity } from '../enitity/state.entity';
import { ProvinceEntity } from '../enitity/province.entity';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/map',
})
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @ResponsePaging('map.state.list', {
        serialization: StateListSerialization,
    })
    @Get('/states')
    async getAllStates(@Paginate() query): Promise<Paginated<StateEntity>> {
        //  console.log(dto._search['$or'][0].name);
        return await this.mapService.findAllStates(query);
    }

    @ResponsePaging('map.province.list', {
        serialization: ProvinceListSerialization,
    })
    @Get('/provinces')
    async getAllProvinces(
        @Paginate() query
    ): Promise<Paginated<ProvinceEntity>> {
        return await this.mapService.findAllPrivinces(query);
    }

    @ResponsePaging('map.burg.list', {
        serialization: BurgListSerialization,
    })
    @Get('/burgs')
    async getAllBurgs(@Paginate() query) {
        return await this.mapService.findAllBurgs(query);
    }
}
