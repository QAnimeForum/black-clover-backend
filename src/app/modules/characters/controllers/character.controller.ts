import {
    Body,
    ConflictException,
    Controller,
    Get,
    Param,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { CharacterService } from '../services/character.service';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import {
    GetCharacterInfoDto,
    GetCharacteristicsDto,
    GetGrimoireDto,
} from '../dto/query-character-info.dto';
import { CreateRaceDto } from '../dto/create-race.dto';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import {
    RACE_DEFAULT_PER_PAGE,
    RACE_DEFAULT_ORDER_BY,
    RACE_DEFAULT_ORDER_DIRECTION,
    RACE_DEFAULT_AVAILABLE_SEARCH,
    RACE_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/race-list.constant';
import { RaceListSerialization } from '../serializations/race.list.serialization';
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
import { RaceGetSerialization } from '../serializations/race.get.serialization';
import { RaceRequestDto } from '../dto/race.request.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';

export enum ENUM_RACE_STATUS_CODE_ERROR {
    RACE_NOT_FOUND_ERROR = 5100,
    RACE_EXIST_ERROR = 5101,
    RACE_USED_ERROR = 5103,
}

@Controller({
    version: VERSION_NEUTRAL,
    path: '/character',
})
export class CharacterController {
    constructor(
        private readonly characterService: CharacterService,
        private readonly paginationService: PaginationService
    ) {}
    @Post('/character')
    createCharacter(dto: CreatePlayableCharacterDto) {
        return this.characterService.createPlayableCharacterDto(dto);
    }
    @Get('/character')
    findCharacter(dto: GetCharacterInfoDto) {
        return this.characterService.getCharacterInfo(dto);
    }

    @Get('/grimouire')
    findGrimoire(dto: GetGrimoireDto) {
        return this.characterService.getGrimoireInfo(dto);
    }

    @ResponsePaging('character.race.list', {
        serialization: RaceListSerialization,
    })
    @Get('/race/list')
    async findAllRaces(
        @PaginationQuery(
            RACE_DEFAULT_PER_PAGE,
            RACE_DEFAULT_ORDER_BY,
            RACE_DEFAULT_ORDER_DIRECTION,
            RACE_DEFAULT_AVAILABLE_SEARCH,
            RACE_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [states, total] = await this.characterService.findAllRaces(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @Response('character.race.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/race/create')
    async createRace(@Body() dto: CreateRaceDto): Promise<IResponse> {
        const exist: boolean = await this.characterService.raceExistByName(
            dto.name
        );
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_RACE_STATUS_CODE_ERROR.RACE_EXIST_ERROR,
                message: 'race.error.exist',
            });
        }

        const create = await this.characterService.createrRace(dto);
        return {
            data: { _id: create.raw[0].id },
        };
    }

    @Response('character.race.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(RaceRequestDto)
    @Get('/race/get/:race')
    async getRace(@Param() params: RaceRequestDto) {
        console.log(params);
        return 'jello';
    }
    @Get('/characteristics')
    findCharacteristics(dto: GetCharacteristicsDto) {
        return this.characterService.findCharacteristics(dto);
    }

    @Get('/spells')
    findAllSpells() {
        return null;
    }

    @Get('/spell')
    findSpell() {
        return null;
    }

    @Post('/spell')
    createSpell() {
        return null;
    }

    @Post('/grimoire')
    createGrimoire() {
        return null;
    }

    @Get('/inventory')
    findInventory() {
        return null;
    }
}
