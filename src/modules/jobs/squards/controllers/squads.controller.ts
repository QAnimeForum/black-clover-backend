import {
    Controller,
    Get,
    Post,
    Delete,
    VERSION_NEUTRAL,
    Param,
    Body,
    ConflictException,
} from '@nestjs/common';
import { FilterOperator, FilterSuffix, Paginate, PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { SquadsService } from '../service/squads.service';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ArmedForcesListSerialization } from '../serializations/armed.forces.list.serialization';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import {
    ARMED_FORCES_DEFAULT_AVAILABLE_ORDER_BY,
    ARMED_FORCES_DEFAULT_AVAILABLE_SEARCH,
    ARMED_FORCES_DEFAULT_ORDER_BY,
    ARMED_FORCES_DEFAULT_ORDER_DIRECTION,
    ARMED_FORCES_DEFAULT_PER_PAGE,
} from '../constants/armed.forces.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ArmedForcesGetSerialization } from '../serializations/armed.forces.get.serialization';
import { ArmedForcesEntity } from '../entity/armed.forces.entity';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ArmedForcesCreateDto } from '../dto/armed.forces.create.dto';
import { ENUM_ARMED_FORCES_STATUS_CODE_ERROR } from '../constants/armed.forces.status-code.constant';
import { ArmedForcesRequestDto } from '../dto/armed.forces.request.dto';
import { SquadListSerialization } from '../serializations/squad.list.serialization';
import { SquadMemberGetSerialization } from '../serializations/squad.member.get.serialization';
import { SquadMemberRequestDto } from '../dto/squad.member.request.dto';
import { ENUM_ARMOR_STATUS_CODE_ERROR } from '../../business/constants/armor.status-code.constant';
import { ArmorListSerialization } from '../../business/serializations/armor.list.serialization';
import { ENUM_SQUAD_MEMBER_STATUS_CODE_ERROR } from '../constants/squad.member.status-code.constant';
import { SquadMemberCreateDto } from '../dto/squad.member.create.dto';
import {
    SQUAD_MEMBER_DEFAULT_AVAILABLE_ORDER_BY,
    SQUAD_MEMBER_DEFAULT_AVAILABLE_SEARCH,
    SQUAD_MEMBER_DEFAULT_ORDER_BY,
    SQUAD_MEMBER_DEFAULT_ORDER_DIRECTION,
    SQUAD_MEMBER_DEFAULT_PER_PAGE,
} from '../constants/squad.member.list.constant';
import { SquadRankRequestDto } from '../dto/squad.rank.request.dto';
import { ENUM_SQUAD_RANK_STATUS_CODE_ERROR } from '../constants/squad.rank.status-code.constant';
import { SquadRankCreateDto } from '../dto/squad.rank.create.dto';
import { SquadRequestDto } from '../dto/squad.request.dto';
import { SquadCreateDto } from '../dto/squad.create.dto';
import { ENUM_SQUAD_STATUS_CODE_ERROR } from '../constants/squad.status-code.constant';
import { SquadGetSerialization } from '../serializations/squad.get.serialization';
import { SquadRankForcesListSerialization } from '../serializations/rank.list.serialization';
import { SquadEntity } from '../entity/squad.entity';
import { ArmedForcesRankEntity } from '../entity/armed.forces.rank.entity';
@Controller({
    version: VERSION_NEUTRAL,
    path: '/squads',
})
export class SquadsController {
    constructor(
        private readonly squadsService: SquadsService,
        private readonly paginationService: PaginationService
    ) {}

    @ResponsePaging('squads.armed_forces.list', {
        serialization: ArmedForcesListSerialization,
    })
    @Get('/armed_forces/list')
    async getAllArmedForces(
        @PaginationQuery(
            ARMED_FORCES_DEFAULT_PER_PAGE,
            ARMED_FORCES_DEFAULT_ORDER_BY,
            ARMED_FORCES_DEFAULT_ORDER_DIRECTION,
            ARMED_FORCES_DEFAULT_AVAILABLE_SEARCH,
            ARMED_FORCES_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [states, total] = await this.squadsService.getAllArmedForces(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @Response('armed_forces.get', {
        serialization: ArmedForcesGetSerialization,
    })
    @RequestParamGuard(ArmedForcesEntity)
    @Get('/armed_forces/get/:armed_forces')
    async getOneArmedForces(
        @Param() params: ArmedForcesRequestDto
    ): Promise<IResponse> {
        const armedForces = await this.squadsService.findArmedForcesById(
            params.armedForcesId
        );
        if (!armedForces) {
            throw new ConflictException({
                statusCode: ENUM_ARMOR_STATUS_CODE_ERROR.ARMOR_EXIST_ERROR,
                message: 'armor.error.exist',
            });
        }
        return {
            data: armedForces,
        };
    }

    @Response('armed_forces.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/armed_forces/create')
    async createArmedForces(
        @Body()
        dto: ArmedForcesCreateDto
    ): Promise<IResponse> {
        try {
            const entity = await this.squadsService.createArmedForces(dto);
            return {
                data: { _id: entity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode:
                    ENUM_ARMED_FORCES_STATUS_CODE_ERROR.ARMED_FORCES_EXIST_ERROR,
                message: 'armed_forces.error.exist',
            });
        }
    }

    @Response('armed_forces.delete')
    @RequestParamGuard(ArmedForcesRequestDto)
    @Delete('/delete/:armed_forces')
    async deleteArmedForces(
        @Param() params: ArmedForcesRequestDto
    ): Promise<void> {
        await this.squadsService.deleteArmedForce(params.armedForcesId);
        return;
    }

    @ResponsePaging('member.list', {
        serialization: SquadListSerialization,
    })
    @Get('/member/list')
    async getAllMembers(
        @PaginationQuery(
            SQUAD_MEMBER_DEFAULT_PER_PAGE,
            SQUAD_MEMBER_DEFAULT_ORDER_BY,
            SQUAD_MEMBER_DEFAULT_ORDER_DIRECTION,
            SQUAD_MEMBER_DEFAULT_AVAILABLE_SEARCH,
            SQUAD_MEMBER_DEFAULT_AVAILABLE_ORDER_BY
        )
        dto: PaginationListDto
    ): Promise<IResponsePaging> {
        const [states, total] =
            await this.squadsService.getAllSquadMembers(dto);
        const totalPage: number = this.paginationService.totalPage(
            total,
            dto._limit
        );
        return {
            _pagination: { totalPage, total },
            data: states,
        };
    }

    @Response('squad.member.get', {
        serialization: SquadMemberGetSerialization,
    })
    @RequestParamGuard(SquadMemberRequestDto)
    @Get('/member/get/:member')
    async getOneMember(
        @Param() params: SquadMemberRequestDto
    ): Promise<IResponse> {
        const member = await this.squadsService.findSquadMemberById(
            params.member
        );
        if (!member) {
            throw new ConflictException({
                statusCode:
                    ENUM_SQUAD_MEMBER_STATUS_CODE_ERROR.SQUAD_MEMBER_EXIST_ERROR,
                message: 'member.error.exist',
            });
        }
        return {
            data: member,
        };
    }

    @Response('member.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/member/create')
    async createMember(
        @Body()
        dto: SquadMemberCreateDto
    ): Promise<IResponse> {
        try {
            const entity = await this.squadsService.createSquadMember(dto);
            return {
                data: { _id: entity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode:
                    ENUM_SQUAD_MEMBER_STATUS_CODE_ERROR.SQUAD_MEMBER_EXIST_ERROR,
                message: 'squad.member.error.exist',
            });
        }
    }

    @Response('member.delete')
    @RequestParamGuard(SquadMemberRequestDto)
    @Delete('/delete/:member')
    async deleteMember(@Param() params: SquadMemberRequestDto): Promise<void> {
        await this.squadsService.deleteSquadMember(params.member);
        return;
    }

    @ResponsePaging('rank.list', {
        serialization: ArmorListSerialization,
    })
    @Get('/rank/list')
    async getAllRanks(
        @Paginate() query: PaginateQuery
    ): Promise<Paginated<ArmedForcesRankEntity>> {
        return this.squadsService.findAllRanks(query);
    }

    @Response('rank.get', {
        serialization: SquadRankForcesListSerialization,
    })
    @RequestParamGuard(SquadRankRequestDto)
    @Get('/rank/get/:rank')
    async getOneRank(@Param() params: SquadRankRequestDto): Promise<IResponse> {
        const armor = await this.squadsService.findRankById(params.rank);
        if (!armor) {
            throw new ConflictException({
                statusCode:
                    ENUM_SQUAD_RANK_STATUS_CODE_ERROR.SQUAD_RANK_EXIST_ERROR,
                message: 'rank.error.exist',
            });
        }
        return {
            data: armor,
        };
    }

    @Response('rank.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/rank/create')
    async createRank(
        @Body()
        dto: SquadRankCreateDto
    ): Promise<IResponse> {
        try {
            const armorEntity = await this.squadsService.createRank(dto);
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

    @Response('rank.delete')
    @RequestParamGuard(SquadRankRequestDto)
    @Delete('/delete/:rank')
    async deleteSquadRank(@Param() params: SquadRankRequestDto): Promise<void> {
        await this.squadsService.deleteSquadRank(params.rank);
        return;
    }

    @ResponsePaging('squad.list', {
        serialization: SquadListSerialization,
    })
    @Get('/squad/list')
    async getAllSquads(
        @Paginate() query: PaginateQuery
    ): Promise<Paginated<SquadEntity>> {
        return this.squadsService.findAllSquads(query);
    }

    @Response('squad.get', {
        serialization: SquadGetSerialization,
    })
    @RequestParamGuard(SquadRequestDto)
    @Get('/squad/get/:squad')
    async getOneSquad(@Param() params: SquadRequestDto): Promise<IResponse> {
        const squad = await this.squadsService.findSquadById(params.squad);
        if (!squad) {
            throw new ConflictException({
                statusCode: ENUM_SQUAD_STATUS_CODE_ERROR.SQUAD_EXIST_ERROR,
                message: 'squad.error.exist',
            });
        }
        return {
            data: squad,
        };
    }

    @Response('squad.create', {
        serialization: ResponseIdSerialization,
    })
    @Post('/squad/create')
    async createSquad(
        @Body()
        dto: SquadCreateDto
    ): Promise<IResponse> {
        try {
            const entity = await this.squadsService.createSquad(dto);
            return {
                data: { _id: entity.raw[0].id },
            };
        } catch (err) {
            throw new ConflictException({
                statusCode: ENUM_SQUAD_STATUS_CODE_ERROR.SQUAD_EXIST_ERROR,
                message: 'squad.error.exist',
            });
        }
    }

    @Response('squad.delete')
    @RequestParamGuard(SquadRequestDto)
    @Delete('/delete/:squad')
    async deleteSquad(@Param() params: SquadRequestDto): Promise<void> {
        await this.squadsService.deleteSquad(params.squad);
        return;
    }
}
