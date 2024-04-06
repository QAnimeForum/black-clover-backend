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
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    IResponsePaging,
    IResponse,
} from 'src/common/response/interfaces/response.interface';
import {
    ResponsePaging,
    Response,
} from 'src/common/response/decorators/response.decorator';
import {
    ARMOR_DEFAULT_PER_PAGE,
    ARMOR_DEFAULT_ORDER_BY,
    ARMOR_DEFAULT_ORDER_DIRECTION,
    ARMOR_DEFAULT_AVAILABLE_SEARCH,
    ARMOR_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/armor.list.constant';
import { ArmorCreateDto } from '../dto/armor.create.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { BusinessService } from '../service/business.service';
import { ArmorRequestDto } from '../dto/armor.request.dto';
import { ArmorGetSerialization } from '../serializations/armor.get.serialization';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_ARMOR_STATUS_CODE_ERROR } from '../constants/armor.status-code.constant';
import { ArmorListSerialization } from '../serializations/armor.list.serialization';
import { WeaponCreateDto } from '../dto/weapon.create.dto';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/business',
})
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
        private readonly paginationService: PaginationService
    ) {}

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/armor/list')
    async getAllArmors(
        @PaginationQuery(
            ARMOR_DEFAULT_PER_PAGE,
            ARMOR_DEFAULT_ORDER_BY,
            ARMOR_DEFAULT_ORDER_DIRECTION,
            ARMOR_DEFAULT_AVAILABLE_SEARCH,
            ARMOR_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [states, total] = await this.businessService.getAllArmors(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @Response('armor.get', {
        serialization: ArmorGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/armor/get/:armor')
    async getOne(@Param() params: ArmorRequestDto): Promise<IResponse> {
        const armor = await this.businessService.findDevilById(params.armor);
        if (!armor) {
            throw new ConflictException({
                statusCode: ENUM_ARMOR_STATUS_CODE_ERROR.ARMOR_EXIST_ERROR,
                message: 'armor.error.exist',
            });
        }
        return {
            data: armor,
        };
    }

    @Response('armor.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/armor/create')
    async create(
        @Body()
        dto: ArmorCreateDto
    ): Promise<IResponse> {
        try {
            const armorEntity = await this.businessService.createArmor(dto);
            return {
                data: { _id: armorEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_ARMOR_STATUS_CODE_ERROR.ARMOR_EXIST_ERROR,
                message: 'devil.error.exist',
            });
        }
    }

    @Response('armor.delete')
    @RequestParamGuard(ArmorRequestDto)
    @Delete('/delete/:devil')
    async delete(@Param() params: ArmorRequestDto): Promise<void> {
        await this.businessService.deleteArmor(params.armor);
        return;
    }

    @Post('/weapon')
    createWeapon(@Body() dto: WeaponCreateDto) {
        console.log(dto);
        this.businessService.createWeapon(dto);
    }

    @Get('/weapon/list')
    async getAllWeaponss(
        @PaginationQuery(
            ARMOR_DEFAULT_PER_PAGE,
            ARMOR_DEFAULT_ORDER_BY,
            ARMOR_DEFAULT_ORDER_DIRECTION,
            ARMOR_DEFAULT_AVAILABLE_SEARCH,
            ARMOR_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        //  console.log(dto._search['$or'][0].name);
        const [states, total] = await this.businessService.getAllWeapons(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }
}
