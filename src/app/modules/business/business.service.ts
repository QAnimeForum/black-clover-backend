import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArmorEntity } from './entity/armor.entity';
import { WeaponEntity } from './entity/weapon.entity';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { CreateArmorDto } from './dto/create-armor.dto';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';

@Injectable()
export class BusinessService {
    constructor(
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>,
        @InjectRepository(WeaponEntity)
        private readonly weaponRepository: Repository<WeaponEntity>
    ) {}
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
}
