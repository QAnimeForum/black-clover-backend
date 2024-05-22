import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { GrimoireRequestDto } from '../../grimoire/dto/grimoire.request.dto';
import { GrimoireService } from '../services/grimoire.service';
import { RaceGetSerialization } from '../../race/serializations/race.get.serialization';
import { ENUM_GRIMOIRE_STATUS_CODE_ERROR } from '../constants/grimoire.status-code.constant';
import { SpellRequestDto } from '../dto/spell.request.dto';
import { SpellCreateDto } from '../dto/spell.create.dto';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ENUM_SPELL_STATUS_CODE_ERROR } from '../constants/spell.status-code.constant';
import { SpellGetSerialization } from '../serializations/spell.get.serialization';
import {
    SPELL_DEFAULT_AVAILABLE_ORDER_BY,
    SPELL_DEFAULT_AVAILABLE_SEARCH,
    SPELL_DEFAULT_ORDER_BY,
    SPELL_DEFAULT_ORDER_DIRECTION,
    SPELL_DEFAULT_PER_PAGE,
} from '../constants/spell.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { SpellListSerialization } from '../serializations/spell.list.serialization';
import { GrimoireCreateDto } from '../dto/grimoire.create.dto';
import { GrimoireGetSerialization } from '../serializations/grimoire.get.serialization';
import {
    GRIMOIRE_DEFAULT_AVAILABLE_ORDER_BY,
    GRIMOIRE_DEFAULT_AVAILABLE_SEARCH,
    GRIMOIRE_DEFAULT_ORDER_BY,
    GRIMOIRE_DEFAULT_ORDER_DIRECTION,
    GRIMOIRE_DEFAULT_PER_PAGE,
} from '../constants/grimoire.list.constant';
import { GrimoireListSerialization } from '../serializations/grimoire.list.serialization';
import { ENUM_WEAPON_STATUS_CODE_ERROR } from '../../business/constants/weapon.status-code.constant';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/grimoire',
})
export class GrimoireController {
    constructor(
        private readonly grimoireService: GrimoireService,
        private readonly paginationService: PaginationService
    ) {}

    @Response('grimoire.get', {
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
                statusCode:
                    ENUM_GRIMOIRE_STATUS_CODE_ERROR.GRIMOIRE_EXIST_ERROR,
                message: 'grimoire.error.exist',
            });
        }
        return {
            data: grimoire,
        };
    }

    @ResponsePaging('grimoire.list', {
        serialization: GrimoireListSerialization,
    })
    @Get('/grimoire/list')
    async getAllWeapons(
        @PaginationQuery(
            GRIMOIRE_DEFAULT_PER_PAGE,
            GRIMOIRE_DEFAULT_ORDER_BY,
            GRIMOIRE_DEFAULT_ORDER_DIRECTION,
            GRIMOIRE_DEFAULT_AVAILABLE_SEARCH,
            GRIMOIRE_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [weapons, total] =
            await this.grimoireService.findAllGrimoires(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: weapons,
        };
    }

    @Response('grimoire.get', {
        serialization: GrimoireGetSerialization,
    })
    @RequestParamGuard(GrimoireRequestDto)
    @Get('/grimoire/get/:weapon')
    async getOneWeapon(
        @Param() params: GrimoireRequestDto
    ): Promise<IResponse> {
        const weapon = await this.grimoireService.findGrimoireById(
            params.grimoire
        );
        if (!weapon) {
            throw new ConflictException({
                statusCode:
                    ENUM_GRIMOIRE_STATUS_CODE_ERROR.GRIMOIRE_EXIST_ERROR,
                message: 'grimoire.error.exist',
            });
        }
        return {
            data: weapon,
        };
    }

    @Response('grimoire.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/grimoire/create')
    async createWeapon(
        @Body()
        dto: GrimoireCreateDto
    ): Promise<IResponse> {
        try {
            const weaponEntity = await this.grimoireService.createGrimoire(dto);
            return {
                data: { _id: weaponEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_WEAPON_STATUS_CODE_ERROR.WEAPON_EXIST_ERROR,
                message: 'weapon.error.exist',
            });
        }
    }

    @Response('grimoire.delete')
    @RequestParamGuard(GrimoireRequestDto)
    @Delete('/delete/:grimoire')
    async deleteWeapon(@Param() params: GrimoireRequestDto): Promise<void> {
        await this.grimoireService.deleteGrimoire(params.grimoire);
        return;
    }

    @ResponsePaging('spell.list', {
        serialization: SpellListSerialization,
    })
    @Get('/spell/list/:grimoireId')
    async getAllSpells(
        @PaginationQuery(
            SPELL_DEFAULT_PER_PAGE,
            SPELL_DEFAULT_ORDER_BY,
            SPELL_DEFAULT_ORDER_DIRECTION,
            SPELL_DEFAULT_AVAILABLE_SEARCH,
            SPELL_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto,
        @Param() params: GrimoireRequestDto
    ): Promise<IResponsePaging> {
        const [spells, total] = await this.grimoireService.findAllSpells(
            dto,
            params.grimoire
        );
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: spells,
        };
    }

    @Response('spell.get', {
        serialization: SpellGetSerialization,
    })
    @RequestParamGuard(SpellRequestDto)
    @Get('/spell/get/:weapon')
    async getOneSpell(@Param() params: SpellRequestDto): Promise<IResponse> {
        const weapon = await this.grimoireService.findSpellById(params.spell);
        if (!weapon) {
            throw new ConflictException({
                statusCode: ENUM_SPELL_STATUS_CODE_ERROR.SPELL_EXIST_ERROR,
                message: 'spell.error.exist',
            });
        }
        return {
            data: weapon,
        };
    }

    @Response('spell.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/spell/create/:grimoireId')
    async createSpell(
        @Body()
        dto: SpellCreateDto
    ): Promise<IResponse> {
        try {
            //TODO change
            const grimoire = await this.grimoireService.findGrimoireById('3r');
            const SpellEntity = await this.grimoireService.createSpell(
                dto,
                grimoire
            );
            return {
                data: { _id: SpellEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_SPELL_STATUS_CODE_ERROR.SPELL_EXIST_ERROR,
                message: 'spell.error.exist',
            });
        }
    }

    @Response('grimoire.spell.delete')
    @RequestParamGuard(SpellRequestDto)
    @Delete('/delete/:spell')
    async deleteSpell(@Param() params: SpellRequestDto): Promise<void> {
        await this.grimoireService.deleteSpell(params.spell);
        return;
    }
}
