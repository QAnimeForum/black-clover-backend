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

    async getAllStates(
        dto: PaginationListDto
    ): Promise<[StateEntity[], number]> {
        const [entities, total] = await this.stateRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
            relations: {
                form: true,
            },
        });
        return [entities, total];
    }

    async getAllProvincies(
        dto: PaginationListDto
    ): Promise<[ProvinceEntity[], number]> {
        console.log(dto);
        const entities = await this.provinceRepository.find({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
            relations: {
                form: true,
            },
        });
        return [entities, 10];
    }

    async getAllBurgs(dto: PaginationListDto): Promise<[BurgEntity[], number]> {
        const [entities, total] = await this.burgRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
        });
        return [entities, total];
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
