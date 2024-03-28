import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateEntity } from '../enitity/state.entity';
import { BurgEntity } from '../enitity/burg.entity';
import { CreateStateDto } from '../dto/create-state.dto';
import { ProvinceFormEntity } from '../enitity/province.form.entity';
import { StateFormEntity } from '../enitity/state.form.entity';
import { ProvinceEntity } from '../enitity/province.entity';

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

    async getAllCountries(): Promise<StateEntity[]> {
        return this.stateRepository.find();
    }

    async getAllProvincies(): Promise<ProvinceEntity[]> {
        return this.provinceRepository.find();
    }

    async getAllBurgs(): Promise<BurgEntity[]> {
        return this.burgRepository.find();
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