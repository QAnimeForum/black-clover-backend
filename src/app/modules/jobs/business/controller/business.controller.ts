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
import { WeaponListSerialization } from '../serializations/weapon.list.serialization';
import { WeaponGetSerialization } from '../serializations/weapon.get.serialization';
import { WeaponRequestDto } from '../dto/weapon.request.dto';
import { ENUM_WEAPON_STATUS_CODE_ERROR } from '../constants/weapon.status-code.constant';
import { WeaponCreateDto } from '../dto/weapon.create.dto';
import { VehicleRequestDto } from '../dto/vehicle.request.dto';
import { VehicleCreateDto } from '../dto/vehicle.create.dto';
import { ENUM_VEHICLE_STATUS_CODE_ERROR } from '../constants/vehicle.status-code.constant';
import {
    VEHICLE_DEFAULT_PER_PAGE,
    VEHICLE_DEFAULT_ORDER_BY,
    VEHICLE_DEFAULT_ORDER_DIRECTION,
    VEHICLE_DEFAULT_AVAILABLE_SEARCH,
    VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/vehicle.list.constant';
import {
    WEAPON_DEFAULT_AVAILABLE_SEARCH,
    WEAPON_DEFAULT_ORDER_BY,
    WEAPON_DEFAULT_ORDER_DIRECTION,
    WEAPON_DEFAULT_PER_PAGE,
} from '../constants/weapon.list.constant';
import { ToolKitRequestDto } from '../dto/toolkit.request.dto';
import { ToolKitCreateDto } from '../dto/toolkit.create.dto';
import { ToolkitGetSerialization } from '../serializations/toolkit.get.serialization';
import { ENUM_TOOLKIT_STATUS_CODE_ERROR } from '../constants/toolkit.status-code.constant';
import { ToolkitListSerialization } from '../serializations/toolkit.list.serialization';
import {
    TOOLKIT_DEFAULT_AVAILABLE_ORDER_BY,
    TOOLKIT_DEFAULT_AVAILABLE_SEARCH,
    TOOLKIT_DEFAULT_ORDER_BY,
    TOOLKIT_DEFAULT_ORDER_DIRECTION,
    TOOLKIT_DEFAULT_PER_PAGE,
} from '../constants/toolkit.list.constant';
import { GearRequestDto } from '../dto/gear.request.dto';
import { GearCreateDto } from '../dto/gear.create.dto';
import { ENUM_GEAR_STATUS_CODE_ERROR } from '../constants/gear.status-code.constant';
import { GearGetSerialization } from '../serializations/gear.get.serialization';
import {
    GEAR_DEFAULT_AVAILABLE_ORDER_BY,
    GEAR_DEFAULT_AVAILABLE_SEARCH,
    GEAR_DEFAULT_ORDER_BY,
    GEAR_DEFAULT_ORDER_DIRECTION,
    GEAR_DEFAULT_PER_PAGE,
} from '../constants/gear.list.constant';
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
    async getOneArmor(@Param() params: ArmorRequestDto): Promise<IResponse> {
        const armor = await this.businessService.findArmorById(params.armor);
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
    async createArmor(
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
                message: 'armor.error.exist',
            });
        }
    }

    @Response('armor.delete')
    @RequestParamGuard(ArmorRequestDto)
    @Delete('/delete/:armor')
    async deleteArmor(@Param() params: ArmorRequestDto): Promise<void> {
        await this.businessService.deleteArmor(params.armor);
        return;
    }

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/gear/list')
    async getAllGeara(
        @PaginationQuery(
            GEAR_DEFAULT_PER_PAGE,
            GEAR_DEFAULT_ORDER_BY,
            GEAR_DEFAULT_ORDER_DIRECTION,
            GEAR_DEFAULT_AVAILABLE_SEARCH,
            GEAR_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [gears, total] = await this.businessService.getlAllGears(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: gears,
        };
    }

    @Response('gear.get', {
        serialization: GearGetSerialization,
    })
    @RequestParamGuard(GearRequestDto)
    @Get('/gear/get/:gear')
    async getOneGear(@Param() params: GearRequestDto): Promise<IResponse> {
        const gear = await this.businessService.findGearById(params.gear);
        if (!gear) {
            throw new ConflictException({
                statusCode: ENUM_GEAR_STATUS_CODE_ERROR.GEAR_EXIST_ERROR,
                message: 'gear.error.exist',
            });
        }
        return {
            data: gear,
        };
    }

    @Response('gear.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/gear/create')
    async createGear(
        @Body()
        dto: GearCreateDto
    ): Promise<IResponse> {
        try {
            const gearEntity = await this.businessService.createGear(dto);
            return {
                data: { _id: gearEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_GEAR_STATUS_CODE_ERROR.GEAR_EXIST_ERROR,
                message: 'gear.error.exist',
            });
        }
    }

    @Response('gear.delete')
    @RequestParamGuard(GearRequestDto)
    @Delete('/gear/:gear')
    async deleteGear(@Param() params: GearRequestDto): Promise<void> {
        await this.businessService.deleteGear(params.gear);
        return;
    }

    @ResponsePaging('toolkit.list', {
        serialization: ToolkitListSerialization,
    })
    @Get('/toolkit/list')
    async getAllToolkits(
        @PaginationQuery(
            TOOLKIT_DEFAULT_PER_PAGE,
            TOOLKIT_DEFAULT_ORDER_BY,
            TOOLKIT_DEFAULT_ORDER_DIRECTION,
            TOOLKIT_DEFAULT_AVAILABLE_SEARCH,
            TOOLKIT_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [toolkits, total] = await this.businessService.getAllTookits(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: toolkits,
        };
    }

    @Response('toolkit.get', {
        serialization: ToolkitGetSerialization,
    })
    @RequestParamGuard(ToolKitRequestDto)
    @Get('/toolkit/get/:toolkit')
    async getOneToolkit(
        @Param() params: ToolKitRequestDto
    ): Promise<IResponse> {
        const toolkit = await this.businessService.findToolkitById(
            params.toolkit
        );
        if (!toolkit) {
            throw new ConflictException({
                statusCode: ENUM_TOOLKIT_STATUS_CODE_ERROR.TOOLKIT_EXIST_ERROR,
                message: 'toolkit.error.exist',
            });
        }
        return {
            data: toolkit,
        };
    }

    @Response('toolkit.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/toolkit/create')
    async createToolkit(
        @Body()
        dto: ToolKitCreateDto
    ): Promise<IResponse> {
        try {
            const toolkitEntity = await this.businessService.createToolkit(dto);
            return {
                data: { _id: toolkitEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_ARMOR_STATUS_CODE_ERROR.ARMOR_EXIST_ERROR,
                message: 'armor.error.exist',
            });
        }
    }

    @Response('tookit.delete')
    @RequestParamGuard(ArmorRequestDto)
    @Delete('/toolkit/delete/:toolkit')
    async deleteToolkit(@Param() params: ToolKitRequestDto): Promise<void> {
        await this.businessService.deleteTookit(params.toolkit);
        return;
    }

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/vehicle/list')
    async getAllVehicle(
        @PaginationQuery(
            VEHICLE_DEFAULT_PER_PAGE,
            VEHICLE_DEFAULT_ORDER_BY,
            VEHICLE_DEFAULT_ORDER_DIRECTION,
            VEHICLE_DEFAULT_AVAILABLE_SEARCH,
            VEHICLE_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [vehicles, total] =
            await this.businessService.getAllVehicles(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: vehicles,
        };
    }

    @Response('vehicle.get', {
        serialization: ArmorGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/vehicle/get/:armor')
    async getOneVehicle(
        @Param() params: VehicleRequestDto
    ): Promise<IResponse> {
        const vehicle = await this.businessService.findVehicleById(
            params.vehicle
        );
        if (!vehicle) {
            throw new ConflictException({
                statusCode: ENUM_VEHICLE_STATUS_CODE_ERROR.VEHICLE_EXIST_ERROR,
                message: 'vehicle.error.exist',
            });
        }
        return {
            data: vehicle,
        };
    }

    @Response('vehicle.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/vehicle/create')
    async createVehicle(
        @Body()
        dto: VehicleCreateDto
    ): Promise<IResponse> {
        try {
            const vehicleEntity = await this.businessService.createVehicle(dto);
            return {
                data: { _id: vehicleEntity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_VEHICLE_STATUS_CODE_ERROR.VEHICLE_EXIST_ERROR,
                message: 'vehicle.error.exist',
            });
        }
    }

    @Response('vehicle.delete')
    @RequestParamGuard(ArmorRequestDto)
    @Delete('/delete/:vehicle')
    async deleteVehicle(@Param() params: VehicleRequestDto): Promise<void> {
        await this.businessService.deleteVehicle(params.vehicle);
        return;
    }

    @ResponsePaging('weapon.list', {
        serialization: WeaponListSerialization,
    })
    @Get('/weapon/list')
    async getAllWeapons(
        @PaginationQuery(
            WEAPON_DEFAULT_PER_PAGE,
            WEAPON_DEFAULT_ORDER_BY,
            WEAPON_DEFAULT_ORDER_DIRECTION,
            WEAPON_DEFAULT_AVAILABLE_SEARCH,
            ARMOR_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [weapons, total] = await this.businessService.getAllArmors(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: weapons,
        };
    }

    @Response('weapon.get', {
        serialization: WeaponGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/weapon/get/:weapon')
    async getOneWeapon(@Param() params: ArmorRequestDto): Promise<IResponse> {
        const weapon = await this.businessService.findWeaponById(params.armor);
        if (!weapon) {
            throw new ConflictException({
                statusCode: ENUM_WEAPON_STATUS_CODE_ERROR.WEAPON_EXIST_ERROR,
                message: 'weapon.error.exist',
            });
        }
        return {
            data: weapon,
        };
    }

    @Response('weapon.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/weapon/create')
    async createWeapon(
        @Body()
        dto: WeaponCreateDto
    ): Promise<IResponse> {
        try {
            const weaponEntity = await this.businessService.createWeapon(dto);
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

    @Response('weapon.delete')
    @RequestParamGuard(WeaponRequestDto)
    @Delete('/delete/:weapon')
    async deleteWeapon(@Param() params: WeaponRequestDto): Promise<void> {
        await this.businessService.deleteWeapon(params.weapon);
        return;
    }
}
