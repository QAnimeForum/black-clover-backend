import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { VehicleCreateDto } from '../dto/vehicle.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleReposiory: Repository<VehicleEntity>
    ) {}

    public findAllVehicles(
        query: PaginateQuery
    ): Promise<Paginated<VehicleEntity>> {
        return paginate(query, this.vehicleReposiory, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                name: [FilterOperator.EQ],
            },
        });
    }

    findVehicleById(id: string): Promise<VehicleEntity | null> {
        return this.vehicleReposiory.findOneBy({ id });
    }
    async createVehicle(dto: VehicleCreateDto) {
        return await this.vehicleReposiory.insert(dto);
    }

    async deleteVehicle(id: string): Promise<void> {
        await this.vehicleReposiory.delete(id);
    }
}
