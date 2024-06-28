import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToolKitEnity } from '../entity/toolkit.entity';
import { ToolKitCreateDto } from '../dto/toolkit.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class ToolkitService {
    constructor(
        @InjectRepository(ToolKitEnity)
        private readonly toolKitRepository: Repository<ToolKitEnity>
    ) {}

    findToolkitById(id: string): Promise<ToolKitEnity | null> {
        return this.toolKitRepository.findOneBy({ id });
    }

    async createToolkit(dto: ToolKitCreateDto) {
        return await this.toolKitRepository.insert(dto);
    }

    public findAllToolkits(
        query: PaginateQuery
    ): Promise<Paginated<ToolKitEnity>> {
        return paginate(query, this.toolKitRepository, {
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
    async deleteTookit(id: string): Promise<void> {
        await this.toolKitRepository.delete(id);
    }
}
