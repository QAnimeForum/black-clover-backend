import { Inject, Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ProficiencyEntity } from '../entity/proficiency.entity';
import { AbilityEntity } from '../entity/ability.entity';
import { ArmorClassEntity } from '../entity/armor.class.entity';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
@Injectable()
export class CharacteristicService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject(GrimoireService) readonly grimoireService: GrimoireService,
        @Inject(InventoryService) readonly inventoryService: InventoryService,
        @InjectRepository(CharacterCharacteristicsEntity)
        private readonly characteristicsRepository: Repository<CharacterCharacteristicsEntity>,
        @InjectRepository(ProficiencyEntity)
        private readonly proficiencyRepository: Repository<ProficiencyEntity>,
        @InjectRepository(AbilityEntity)
        private readonly abilityRepository: Repository<AbilityEntity>,

        @InjectRepository(ArmorClassEntity)
        private readonly armorClassRepository: Repository<ArmorClassEntity>
    ) {}
    async createCharacteristics(transactionalEntityManager: EntityManager) {
        const proficiency = new ProficiencyEntity();
        proficiency.level = 1;
        proficiency.extraBonus = 0;
        await transactionalEntityManager.save(proficiency);

        const strengthEntity = new AbilityEntity();
        strengthEntity.score = 10;
        strengthEntity.modifier = 0;
        await transactionalEntityManager.save(strengthEntity);

        const dexterityEntity = new AbilityEntity();
        dexterityEntity.score = 10;
        dexterityEntity.modifier = 0;
        await transactionalEntityManager.save(dexterityEntity);

        const constitutionEntity = new AbilityEntity();
        constitutionEntity.score = 10;
        constitutionEntity.modifier = 0;
        await transactionalEntityManager.save(constitutionEntity);

        const intelligenceEntity = new AbilityEntity();
        intelligenceEntity.score = 10;
        intelligenceEntity.modifier = 0;
        await transactionalEntityManager.save(intelligenceEntity);

        const wisdomEntity = new AbilityEntity();
        wisdomEntity.score = 10;
        wisdomEntity.modifier = 0;
        await transactionalEntityManager.save(wisdomEntity);

        const charismaEntity = new AbilityEntity();
        charismaEntity.score = 10;
        charismaEntity.modifier = 0;
        await transactionalEntityManager.save(charismaEntity);
        /**
         * класс защиты
         */
        const armorClassEntity = new ArmorClassEntity();
        armorClassEntity.base = 10;
        armorClassEntity.bonus = 0;
        await transactionalEntityManager.save(armorClassEntity);

        const characteristitcsEntity = new CharacterCharacteristicsEntity();
        characteristitcsEntity.currentHealth = 500;
        characteristitcsEntity.maxHealth = 500;
        characteristitcsEntity.currentLevel = 1;
        characteristitcsEntity.experience = 0;
        characteristitcsEntity.maxLevel = 20;
        characteristitcsEntity.hunger = 0;
        characteristitcsEntity.sanity = 0;
        characteristitcsEntity.proficiency = proficiency;
        characteristitcsEntity.strength = strengthEntity;
        characteristitcsEntity.dexterity = dexterityEntity;
        characteristitcsEntity.constitution = constitutionEntity;
        characteristitcsEntity.intelligence = intelligenceEntity;
        characteristitcsEntity.wisdom = wisdomEntity;
        characteristitcsEntity.charisma = charismaEntity;
        characteristitcsEntity.armorClass = armorClassEntity;
        await transactionalEntityManager.save(characteristitcsEntity);
        return characteristitcsEntity;
    }

    async getCharacteristicsById(
        characteristicsId: string
    ): Promise<CharacterCharacteristicsEntity> {
        const entity = await this.characteristicsRepository.findOne({
            where: {
                id: characteristicsId,
            },
            relations: {
                proficiency: true,
                strength: true,
                dexterity: true,
                constitution: true,
                intelligence: true,
                wisdom: true,
                charisma: true,
                armorClass: true,
            },
        });
        return entity;
    }
}
