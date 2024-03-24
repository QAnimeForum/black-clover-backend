import { Controller, Get } from '@nestjs/common';
import { MapService } from '../service/map.service';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Get('/countries')
    getAllCountries() {
        return this.mapService.getAllCountries();
    }
}
