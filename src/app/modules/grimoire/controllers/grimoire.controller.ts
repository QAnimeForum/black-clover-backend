import {
    ConflictException,
    Controller,
    Get,
    Param,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { Response } from 'src/common/response/decorators/response.decorator';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { GrimoireRequestDto } from '../../grimoire/dto/grimoire.request.dto';
import { GrimoireService } from '../services/grimoire.service';
import { RaceGetSerialization } from '../../race/serializations/race.get.serialization';
import { ENUM_GRIMOIRE_STATUS_CODE_ERROR } from '../constants/grimoire.status-code.constant';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/grimoire',
})
export class GrimoireController {
    constructor(
        private readonly grimoireService: GrimoireService,
        private readonly paginationService: PaginationService
    ) {}

    @Response('character.grimoire.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(GrimoireRequestDto)
    @Get('/get/:grimoire')
    async findGrimoire(@Param() params: GrimoireRequestDto) {
        const grimoire = await this.grimoireService.findGrimoireById(
            params.grimoire
        );
        if (!grimoire) {
            throw new ConflictException({
                statusCode: ENUM_GRIMOIRE_STATUS_CODE_ERROR.GRIMOIRE_EXIST_ERROR,
                message: 'grimoire.error.exist',
            });
        }
        return {
            data: grimoire,
        };
    }
}
