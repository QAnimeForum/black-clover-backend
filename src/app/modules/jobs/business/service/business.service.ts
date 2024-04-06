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
import { InventoryEntity } from 'src/app/modules/character/entity/inventory.entity';
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
    async getAllArmors(
        dto: PaginationListDto
    ): Promise<[ArmorEntity[], number]> {
        const [entities, total] = await this.armorRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
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

    async getAllClothes(
        dto: PaginationListDto
    ): Promise<[ClothesEntity[], number]> {
        const [entities, total] = await this.clothesRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
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

    async getlAllGears(
        dto: PaginationListDto
    ): Promise<[GearCreateDto[], number]> {
        const [entities, total] = await this.gearRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
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

    async getAllTookits(
        dto: PaginationListDto
    ): Promise<[ToolKitEnity[], number]> {
        const [entities, total] = await this.toolKitRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
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

    async getAllVehicles(
        dto: PaginationListDto
    ): Promise<[VehicleEntity[], number]> {
        const [entities, total] = await this.vehicleReposiory.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
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

    async getAllWeapons(
        dto: PaginationListDto
    ): Promise<[WeaponEntity[], number]> {
        const [entities, total] = await this.weaponRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
    }
    async deleteWeapon(id: string): Promise<void> {
        await this.weaponRepository.delete(id);
    }
}
