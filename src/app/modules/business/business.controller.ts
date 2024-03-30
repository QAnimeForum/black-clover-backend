import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { CreateArmorDto } from './dto/create-armor.dto';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { BusinessService } from './business.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import {
    ARMOR_DEFAULT_PER_PAGE,
    ARMOR_DEFAULT_ORDER_BY,
    ARMOR_DEFAULT_ORDER_DIRECTION,
    ARMOR_DEFAULT_AVAILABLE_SEARCH,
    ARMOR_DEFAULT_AVAILABLE_ORDER_BY,
} from './constants/business.constants';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/business',
})
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
        private readonly paginationService: PaginationService
    ) {}

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
        //  console.log(dto._search['$or'][0].name);
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

    @Post('/armor')
    createArmor(@Body() dto: CreateArmorDto) {
        this.businessService.createArmor(dto);
    }

    @Post('/weapon')
    createWeapon(@Body() dto: CreateWeaponDto) {
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
