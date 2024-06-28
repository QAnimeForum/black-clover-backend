import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArmorEntity } from '../entity/armor.entity';
import { ArmorCreateDto } from '../dto/armor.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class ArmorService {
    constructor(
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>
    ) {}

    public findAllArmors(
        query: PaginateQuery
    ): Promise<Paginated<ArmorEntity>> {
        return paginate(query, this.armorRepository, {
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

    findArmorById(id: string): Promise<ArmorEntity | null> {
        return this.armorRepository.findOneBy({ id });
    }
    async createArmor(dto: ArmorCreateDto) {
        const armor = new ArmorEntity();
        armor.name = dto.name;
        armor.armorType = dto.armorType;
        armor.cost = dto.cost;
        armor.acBase = dto.ac.base;
        armor.acBonus = dto.ac.bonus;
        armor.strengthPrerequisite = dto.strengthPrerequisite;
        armor.stealthDisadvantage = dto.stealthDisadvantage;
        armor.weight = dto.weight;
        return this.armorRepository.insert(armor);
    }

    async deleteArmor(id: string): Promise<void> {
        await this.armorRepository.delete(id);
    }
}
