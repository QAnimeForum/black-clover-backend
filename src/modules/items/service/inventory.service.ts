import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WeaponEntity } from '../entity/weapon.entity';
import { WeaponCreateDto } from '../dto/weapon.create.dto';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { InventoryEntity } from '../../character/entity/inventory.entity';
import { EquipmentEntity } from '../entity/equipment.entity';
@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(EquipmentEntity)
        private readonly equipomentRepository: Repository<EquipmentEntity>
    ) {}

    async createInventory(transactionalEntityManager: EntityManager) {
        const inventory = new InventoryEntity();
        transactionalEntityManager.save(inventory);
        return inventory;
    }
    async getInventoryById(characterId: string): Promise<InventoryEntity> {
        return await this.inventoryRepository
            .createQueryBuilder('background')
            .innerJoinAndSelect(
                'inventory.character',
                'charcter',
                'character.id = :characterId',
                { characterId: characterId }
            )
            .getOne();
    }
}
