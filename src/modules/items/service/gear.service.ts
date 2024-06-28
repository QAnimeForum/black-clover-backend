import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GearEntity } from '../entity/gear.entity';
import { GearCreateDto } from '../dto/gear.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class GearService {
    constructor(
        @InjectRepository(GearEntity)
        private readonly gearRepository: Repository<GearEntity>
    ) {}
    findGearById(id: string): Promise<GearEntity | null> {
        return this.gearRepository.findOneBy({ id });
    }
    async createGear(dto: GearCreateDto) {
        return await this.gearRepository.insert(dto);
    }

    public findAllGears(query: PaginateQuery): Promise<Paginated<GearEntity>> {
        return paginate(query, this.gearRepository, {
            sortableColumns: ['id', 'itemType'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['itemType'],
            select: ['id', 'itemType'],
            filterableColumns: {
                itemType: [FilterOperator.EQ],
            },
        });
    }

    async deleteGear(id: string): Promise<void> {
        await this.gearRepository.delete(id);
    }
}
