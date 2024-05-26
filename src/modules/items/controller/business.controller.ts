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
import { IResponse } from 'src/common/response/interfaces/response.interface';
import {
    ResponsePaging,
    Response,
} from 'src/common/response/decorators/response.decorator';
import { ArmorCreateDto } from '../dto/armor.create.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
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
import { ToolKitRequestDto } from '../dto/toolkit.request.dto';
import { ToolKitCreateDto } from '../dto/toolkit.create.dto';
import { ToolkitGetSerialization } from '../serializations/toolkit.get.serialization';
import { ENUM_TOOLKIT_STATUS_CODE_ERROR } from '../constants/toolkit.status-code.constant';
import { ToolkitListSerialization } from '../serializations/toolkit.list.serialization';
import { GearRequestDto } from '../dto/gear.request.dto';
import { GearCreateDto } from '../dto/gear.create.dto';
import { ENUM_GEAR_STATUS_CODE_ERROR } from '../constants/gear.status-code.constant';
import { GearGetSerialization } from '../serializations/gear.get.serialization';

import { Paginate, Paginated } from 'nestjs-paginate';
import { ArmorEntity } from '../entity/armor.entity';
import { WeaponEntity } from '../entity/weapon.entity';
import { VehicleEntity } from '../entity/vehicle.entity';
import { GearEntity } from '../entity/gear.entity';
import { ToolKitEnity } from '../entity/toolkit.entity';
import { ArmorService } from '../service/armor.service';
import { GearService } from '../service/gear.service';
import { ToolkitService } from '../service/toolkit.service';
import { VehicleService } from '../service/vehicles.service';
import { WeaponService } from '../service/weapon.service';
@Controller({
    version: VERSION_NEUTRAL,
    path: '/business',
})
export class BusinessController {
    constructor(private readonly armorService: ArmorService,
        private readonly gearService: GearService,
        private readonly toolkitService: ToolkitService,
        private readonly vehicleService: VehicleService,
        private readonly weaponService: WeaponService,    ) {}

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/armor/list')
    async getAllArmors(@Paginate() query): Promise<Paginated<ArmorEntity>> {
        return this.armorService.findAllArmors(query);
    }

    @Response('armor.get', {
        serialization: ArmorGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/armor/get/:armor')
    async getOneArmor(@Param() params: ArmorRequestDto): Promise<IResponse> {
        const armor = await this.armorService.findArmorById(params.armor);
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
            const armorEntity = await this.armorService.createArmor(dto);
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
        await this.armorService.deleteArmor(params.armor);
        return;
    }

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/gear/list')
    async getAllGears(@Paginate() query): Promise<Paginated<GearEntity>> {
        return this.gearService.findAllGears(query);
    }

    @Response('gear.get', {
        serialization: GearGetSerialization,
    })
    @RequestParamGuard(GearRequestDto)
    @Get('/gear/get/:gear')
    async getOneGear(@Param() params: GearRequestDto): Promise<IResponse> {
        const gear = await this.gearService.findGearById(params.gear);
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
            const gearEntity = await this.gearService.createGear(dto);
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
        await this.gearService.deleteGear(params.gear);
        return;
    }

    @ResponsePaging('toolkit.list', {
        serialization: ToolkitListSerialization,
    })
    @Get('/toolkit/list')
    async getAllToolkits(@Paginate() query): Promise<Paginated<ToolKitEnity>> {
        return this.toolkitService.findAllToolkits(query);
    }

    @Response('toolkit.get', {
        serialization: ToolkitGetSerialization,
    })
    @RequestParamGuard(ToolKitRequestDto)
    @Get('/toolkit/get/:toolkit')
    async getOneToolkit(
        @Param() params: ToolKitRequestDto
    ): Promise<IResponse> {
        const toolkit = await this.toolkitService.findToolkitById(
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
            const toolkitEntity = await this.toolkitService.createToolkit(dto);
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
        await this.toolkitService.deleteTookit(params.toolkit);
        return;
    }

    @ResponsePaging('armor.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/vehicle/list')
    async getAllVehicle(@Paginate() query): Promise<Paginated<VehicleEntity>> {
        return this.vehicleService.findAllVehicles(query);
    }

    @Response('vehicle.get', {
        serialization: ArmorGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/vehicle/get/:armor')
    async getOneVehicle(
        @Param() params: VehicleRequestDto
    ): Promise<IResponse> {
        const vehicle = await this.vehicleService.findVehicleById(
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
            const vehicleEntity = await this.vehicleService.createVehicle(dto);
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
        await this.vehicleService.deleteVehicle(params.vehicle);
        return;
    }

    @ResponsePaging('weapon.list', {
        serialization: WeaponListSerialization,
    })
    @Get('/weapon/list')
    async getAllWeapons(@Paginate() query): Promise<Paginated<WeaponEntity>> {
        return await this.weaponService.findAllWeapons(query);
    }

    @Response('weapon.get', {
        serialization: WeaponGetSerialization,
    })
    @RequestParamGuard(ArmorRequestDto)
    @Get('/weapon/get/:weapon')
    async getOneWeapon(@Param() params: ArmorRequestDto): Promise<IResponse> {
        const weapon = await this.weaponService.findWeaponById(params.armor);
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
            const weaponEntity = await this.weaponService.createWeapon(dto);
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
        await this.weaponService.deleteWeapon(params.weapon);
        return;
    }
}
