import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeaponEntity } from '../entity/weapon.entity';
import { WeaponCreateDto } from '../dto/weapon.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class WeaponService {
    constructor(
        @InjectRepository(WeaponEntity)
        private readonly weaponRepository: Repository<WeaponEntity>,
    ) {}

    findWeaponById(id: string): Promise<WeaponEntity | null> {
        return this.weaponRepository.findOneBy({ id });
    }
    async createWeapon(dto: WeaponCreateDto) {
        return await this.weaponRepository.insert(dto);
    }

    public findAllWeapons(
        query: PaginateQuery
    ): Promise<Paginated<WeaponEntity>> {
        return paginate(query, this.weaponRepository, {
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

    async deleteWeapon(id: string): Promise<void> {
        await this.weaponRepository.delete(id);
    }
}
