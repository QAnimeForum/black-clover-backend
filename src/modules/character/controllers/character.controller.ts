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
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { RaceGetSerialization } from '../../race/serializations/race.get.serialization';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { CharacterRequestDto } from '../dto/character.request.dto';
import { GrimoireRequestDto } from '../../grimoire/dto/grimoire.request.dto';
import { CharacteristicsRequestDto } from '../dto/characteristics.request.dto';
import { ENUM_CHARACTER_STATUS_CODE_ERROR } from '../constants/character.status-code.constant';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/character',
})
export class CharacterController {
    constructor(
        private readonly characterService: CharacterService,
        private readonly paginationService: PaginationService
    ) {}

    @Response('character.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/character/create')
    async createCharacter(@Body() dto: CreatePlayableCharacterDto) {
        const create =
            await this.characterService.createPlayableCharacterDto(dto);
        return {
            data: { _id: create.id },
        };
    }

    @Response('character.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(CharacterRequestDto)
    @Get('/character/get/:character')
    async getCharacter(
        @Param() params: CharacterRequestDto
    ): Promise<IResponse> {
        const character = await this.characterService.getCharacterById(
            params.character
        );
        if (!character) {
            throw new ConflictException({
                statusCode:
                    ENUM_CHARACTER_STATUS_CODE_ERROR.CHARACTER_EXIST_ERROR,
                message: 'character.characer.error.exist',
            });
        }
        return {
            data: character,
        };
    }

    @Response('grimoire.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(GrimoireRequestDto)
    @Get('/grimouire/get/:grimoire')
    async findGrimoire(@Param() params: GrimoireRequestDto) {
        const character = await this.characterService.getCharacterById(
            params.grimoire
        );
        if (!character) {
            throw new ConflictException({
                statusCode:
                    ENUM_CHARACTER_STATUS_CODE_ERROR.CHARACTER_EXIST_ERROR,
                message: 'character.grimoire.error.exist',
            });
        }
        return {
            data: character,
        };
    }

    @Response('chracteristics.get', {
        serialization: RaceGetSerialization,
    })
    @RequestParamGuard(GrimoireRequestDto)
    @Get('/characteristics/get/:characteristics')
    async findCharacteristics(@Param() params: CharacteristicsRequestDto) {
        const characteristics =
            await this.characterService.getCharacteristicsById(
                params.chracteristics
            );
        if (!characteristics) {
            throw new ConflictException({
                statusCode:
                    ENUM_CHARACTER_STATUS_CODE_ERROR.CHARACTER_NOT_FOUND_ERROR,
                message: 'character.grimoire.error.exist',
            });
        }
        return {
            data: characteristics,
        };
    }
}
