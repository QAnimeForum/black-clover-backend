import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateEntity } from '../enitity/state.entity';
import { BurgEntity } from '../enitity/burg.entity';
import { CreateStateDto } from '../dto/create-state.dto';
import { ProvinceFormEntity } from '../enitity/province.form.entity';
import { StateFormEntity } from '../enitity/state.form.entity';
import { ProvinceEntity } from '../enitity/province.entity';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class MapService {
    constructor(
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>,
        @InjectRepository(ProvinceEntity)
        private readonly provinceRepository: Repository<ProvinceEntity>,
        @InjectRepository(ProvinceFormEntity)
        private readonly provinceFormEntity: Repository<ProvinceFormEntity>,
        @InjectRepository(StateFormEntity)
        private readonly stateFormEntity: Repository<StateFormEntity>,
        @InjectRepository(BurgEntity)
        private readonly burgRepository: Repository<BurgEntity>
    ) {}

    public findAllStates(
        query: PaginateQuery
    ): Promise<Paginated<StateEntity>> {
        return paginate(query, this.stateRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: [
                'id',
                'name',
                'fullName',
                'symbol',
                'bonusHp',
                'bonusMagicPower',
            ],
            relations: ['form'],
            filterableColumns: {
                state_id: true,
            },
        });
    }

    public findAllPrivinces(
        query: PaginateQuery
    ): Promise<Paginated<ProvinceEntity>> {
        return paginate(query, this.provinceRepository, {
            sortableColumns: ['id', 'fullName'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: ['id', 'fullName', 'shortName', 'state_id', 'state'],
            relations: ['form', 'state'],
            filterableColumns: {
                state_id: true,
                'state.id': true,
            },
        });
    }

    public async findCapital(stateId: string) {
        return await this.burgRepository.findOne({
            where: {
                isCaptial: true,
                province: {
                    stateId: stateId,
                },
            },
            relations: {
                province: true,
            },
        });
    }
    public findAllBurgs(query: PaginateQuery): Promise<Paginated<BurgEntity>> {
        return paginate(query, this.burgRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: ['id', 'name', 'province'],
            relations: ['province'],
            filterableColumns: {
                province_id: true,
                'province.id': true,
            },
        });
    }

    async createState(data: CreateStateDto): Promise<StateEntity> {
        const entity: StateEntity = new StateEntity();
        entity.name = data.name;
        entity.description = data.description;
        return this.stateRepository.create(entity);
    }

    async createManyStates(
        data: Array<CreateStateDto>
    ): Promise<StateEntity[]> {
        const create: StateEntity[] = data.map(({ name, description }) => {
            const entity: StateEntity = new StateEntity();
            entity.name = name;
            entity.description = description;
            return entity;
        });
        return this.stateRepository.create(create);
    }

    async findStateById(stateId: string) {
        return await this.stateRepository.findOne({
            where: {
                id: stateId,
            },
            relations: {
                form: true,
            },
        });
    }

    async findRegionById(regionId: string) {
        return await this.provinceRepository.findOne({
            where: {
                id: regionId,
            },
        });
    }
    
    

    async findBurgById(burgId: string) {
        return await this.burgRepository.findOne({
            where: {
                id: burgId,
            }
        });
    }

    async findStateSymbolById(stateId: string): Promise<string> {
        return (
            await this.stateRepository.findOne({
                where: {
                    id: stateId,
                },
                select: {
                    symbol: true,
                },
            })
        ).symbol;
    }
    /**
 *     async createMany(
        data: RoleCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        const create: RoleEntity[] = data.map(({ type, name, permissions }) => {
            const entity: RoleEntity = new RoleEntity();
            entity.type = type;
            entity.isActive = true;
            entity.name = name;
            entity.permissions = permissions;

            return entity;
        });
        return this.roleRepository.createMany<RoleEntity>(create, options);
    }
 */
}
