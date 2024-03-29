import { Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { CharacterService } from '../services/character.service';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import {
    GetCharacterInfoDto,
    GetCharacteristicsDto,
    GetGrimoireDto,
} from '../dto/query-character-info.dto';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/character',
})
export class CharacterController {
    constructor(private readonly characterService: CharacterService) {}
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

    @Get('/race/all')
    findAllRaces() {
        return this.characterService.findAllRaces();
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
