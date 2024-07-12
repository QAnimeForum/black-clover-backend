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
import { EquipmentEntity } from 'src/modules/items/entity/equipment.entity';
import { StateEntity } from 'src/modules/map/enitity/state.entity';
import { RaceEntity } from 'src/modules/race/entity/race.entity';
import { BackgroundEntity } from '../entity/background.entity';
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
        private readonly armorClassRepository: Repository<ArmorClassEntity>,
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>,
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>
    ) {}
    async createCharacteristics(
        transactionalEntityManager: EntityManager,
        raceId: string,
        stateId: string
    ) {
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

        const race = await this.raceRepository.findOneBy({
            id: raceId,
        });
        const state = await this.stateRepository.findOneBy({
            id: stateId,
        });
        const characteristitcsEntity = new CharacterCharacteristicsEntity();
        characteristitcsEntity.currentHealth = race.bonusHp + state.bonusHp;
        characteristitcsEntity.maxHealth = race.bonusHp + state.bonusHp;
        characteristitcsEntity.currentLevel = 1;
        characteristitcsEntity.magicPower =
            race.bonusMagicPower + state.bonusMagicPower;
        characteristitcsEntity.experience = 0;
        characteristitcsEntity.maxLevel = 20;
        characteristitcsEntity.hunger = 0;
        characteristitcsEntity.sanity = 100;
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

    async changeRace(dto: ChangeRaceDto) {
        await this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const race = await this.raceRepository.findOneBy({
                    id: dto.raceId,
                });
                const character = await this.characterRepository.findOne({
                    where: {
                        id: dto.characterId,
                    },
                    relations: {
                        background: {
                            race: true,
                            state: true,
                        },
                        characterCharacteristics: true,
                    },
                });

                await transactionManager
                    .createQueryBuilder()
                    .update(CharacterCharacteristicsEntity)
                    .set({
                        currentHealth:
                            race.bonusHp + character.background.state.bonusHp,
                        maxHealth:
                            race.bonusHp + character.background.state.bonusHp,
                        magicPower:
                            race.bonusMagicPower +
                            character.background.state.bonusMagicPower,
                    })
                    .where('id = :id', {
                        id: character.characterCharacteristics.id,
                    })
                    .execute();
                await transactionManager
                    .createQueryBuilder()
                    .update(BackgroundEntity)
                    .set({
                        raceId: race.id,
                    })
                    .where('id = :id', {
                        id: character.background.id,
                    })
                    .execute();
            }
        );
    }

    async changeState(dto: ChangeStateDto) {
        await this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const state = await this.stateRepository.findOneBy({
                    id: dto.state,
                });
                const character = await this.characterRepository.findOne({
                    where: {
                        id: dto.characterId,
                    },
                    relations: {
                        background: {
                            race: true,
                            state: true,
                        },
                        characterCharacteristics: true,
                    },
                });

                await transactionManager
                    .createQueryBuilder()
                    .update(CharacterCharacteristicsEntity)
                    .set({
                        currentHealth:
                            state.bonusHp + character.background.race.bonusHp,
                        maxHealth:
                            state.bonusHp + character.background.race.bonusHp,
                        magicPower:
                            state.bonusMagicPower +
                            character.background.race.bonusMagicPower,
                    })
                    .where('id = :id', {
                        id: character.characterCharacteristics.id,
                    })
                    .execute();
                await transactionManager
                    .createQueryBuilder()
                    .update(BackgroundEntity)
                    .set({
                        stateId: state.id,
                    })
                    .where('id = :id', {
                        id: character.background.id,
                    })
                    .execute();
            }
        );
    }
}

export class ChangeRaceDto {
    raceId: string;
    characterId: string;
}

export class ChangeStateDto {
    state: string;
    characterId: string;
}
