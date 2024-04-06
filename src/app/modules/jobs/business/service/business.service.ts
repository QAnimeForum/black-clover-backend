import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { CreateArmorDto } from '../dto/armor.create.dto';
import { CreateWeaponDto } from '../dto/weapon.create.dto';
import { ArmorEntity } from '../entity/armor.entity';
import { WeaponEntity } from '../entity/weapon.entity';
import { GearEntity } from '../entity/gear.entity';
import { VehicleEntity } from '../entity/vehicle.entity';
import { ToolKitEnity } from '../entity/toolkit.entity';
@Injectable()
export class BusinessService {
    constructor(
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>,
        @InjectRepository(GearEntity)
        private readonly gearRepository: Repository<GearEntity>,
        @InjectRepository(ToolKitEnity)
        private readonly toolKitRepository: Repository<ToolKitEnity>,
        @InjectRepository(VehicleEntity)
        private readonly vehicleReposiory: Repository<VehicleEntity>,
        @InjectRepository(WeaponEntity)
        private readonly weaponRepository: Repository<WeaponEntity>
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
    async createArmor(dto: CreateArmorDto) {
        const armor = new ArmorEntity();
        armor.name = dto.name;
        armor.armorType = dto.armorType;
        armor.cost = dto.cost;
        armor.acBase = dto.ac.base;
        armor.acBonus = dto.ac.bonus;
        armor.strengthPrerequisite = dto.strengthPrerequisite;
        armor.stealthDisadvantage = dto.stealthDisadvantage;
        armor.weight = dto.weight;
        this.armorRepository.insert(armor);
    }

    async createWeapon(dto: CreateWeaponDto) {
        await this.weaponRepository.insert(dto);
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
}
