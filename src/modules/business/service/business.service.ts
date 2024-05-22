import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { ArmorEntity } from '../entity/armor.entity';
import { WeaponEntity } from '../entity/weapon.entity';
import { GearEntity } from '../entity/gear.entity';
import { VehicleEntity } from '../entity/vehicle.entity';
import { ToolKitEnity } from '../entity/toolkit.entity';
import { ClothesEntity } from '../entity/clothes.entity';
import { ClothesCreateDto } from '../dto/clothes.create.dto';
import { GearCreateDto } from '../dto/gear.create.dto';
import { VehicleCreateDto } from '../dto/vehicle.create.dto';
import { ToolKitCreateDto } from '../dto/toolkit.create.dto';
import { WeaponCreateDto } from '../dto/weapon.create.dto';
import { ArmorCreateDto } from '../dto/armor.create.dto';
import { InventoryEntity } from '../../character/entity/inventory.entity';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
@Injectable()
export class BusinessService {
    constructor(
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>,
        @InjectRepository(ClothesEntity)
        private readonly clothesRepository: Repository<ClothesEntity>,
        @InjectRepository(GearEntity)
        private readonly gearRepository: Repository<GearEntity>,
        @InjectRepository(ToolKitEnity)
        private readonly toolKitRepository: Repository<ToolKitEnity>,
        @InjectRepository(VehicleEntity)
        private readonly vehicleReposiory: Repository<VehicleEntity>,
        @InjectRepository(WeaponEntity)
        private readonly weaponRepository: Repository<WeaponEntity>,
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>
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

    findClothesById(id: string): Promise<ClothesEntity | null> {
        return this.clothesRepository.findOneBy({ id });
    }

    async createClothes(dto: ClothesCreateDto) {
        await this.clothesRepository.insert(dto);
    }

    public findAllClothes(
        query: PaginateQuery
    ): Promise<Paginated<ClothesEntity>> {
        return paginate(query, this.clothesRepository, {
            sortableColumns: ['id', 'category'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['category'],
            select: ['id', 'name'],
            filterableColumns: {
                category: [FilterOperator.EQ],
            },
        });
    }

    async deleteClothes(id: string): Promise<void> {
        await this.clothesRepository.delete(id);
    }

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

    findVehicleById(id: string): Promise<VehicleEntity | null> {
        return this.vehicleReposiory.findOneBy({ id });
    }

    async deleteTookit(id: string): Promise<void> {
        await this.vehicleReposiory.delete(id);
    }
    async createVehicle(dto: VehicleCreateDto) {
        return await this.weaponRepository.insert(dto);
    }

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

    async deleteVehicle(id: string): Promise<void> {
        await this.vehicleReposiory.delete(id);
    }

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
