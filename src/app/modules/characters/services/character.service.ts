import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrimoireEntity } from '../../grimoire/entity/grimoire.entity';
import { CharacterType } from '../constants/character.type.enum';
import { BackgroundEnity } from '../entity/background.entity';
import { RaceEntity } from '../entity/race.entity';
import { StateEntity } from '../../map/enitity/state.entity';
import { CreatePlayableCharacterDto } from '../dto/CreatePlayableCharacterDto';
import { InventoryEntity } from '../entity/inventory.entity';
import {
    AbilityEntity,
    ArmorClassEntity,
    CharacterCharacteristicsEntity,
    ProficiencyEntity,
} from '../entity/character.characteristics.entity';
import { ArmorEntity } from '../entity/armor.entity';
@Injectable()
export class CharacterService {
    constructor(
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(BackgroundEnity)
        private readonly backgroundRepository: Repository<BackgroundEnity>,
        @InjectRepository(CharacterCharacteristicsEntity)
        private readonly characteristicsRepository: Repository<CharacterCharacteristicsEntity>,

        @InjectRepository(ProficiencyEntity)
        private readonly proficiencyRepository: Repository<ProficiencyEntity>,
        @InjectRepository(CharacterCharacteristicsEntity)
        private readonly abilityRepository: Repository<AbilityEntity>,
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>,
        @InjectRepository(ArmorClassEntity)
        private readonly armorClassRepository: Repository<ArmorClassEntity>,
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(StateEntity)
        private readonly stateEntity: Repository<StateEntity>
    ) {}
    async createPlayableCharacterDto(dto: CreatePlayableCharacterDto) {
        const character = new CharacterEntity();
        character.type = CharacterType.PC;

        /**
         * Создание характеристик персонажа
         */
        const characteristics = new CharacterCharacteristicsEntity();
        characteristics.currentHealth = 500;
        characteristics.maxHealth = 500;
        characteristics.currentLevel = 1;
        characteristics.maxLevel = 20;
        this.characteristicsRepository.insert(characteristics);

        const proficiency: ProficiencyEntity = new ProficiencyEntity();
        proficiency.level = 1;
        proficiency.extraBonus = 0;
        this.proficiencyRepository.insert(proficiency);
        const strength: AbilityEntity = new AbilityEntity();
        strength.name = 'Сила';
        strength.abbr = '💪';
        strength.score = 10;
        strength.modifier = 0;
        strength.characterCharacteristics = characteristics;
        this.abilityRepository.insert(strength);

        const dexterity: AbilityEntity = new AbilityEntity();
        dexterity.name = 'Ловкость';
        dexterity.abbr = '🏃';
        dexterity.score = 10;
        dexterity.modifier = 0;
        dexterity.characterCharacteristics = characteristics;
        this.abilityRepository.insert(dexterity);

        const constitution: AbilityEntity = new AbilityEntity();
        constitution.name = 'Телосложение';
        constitution.abbr = '🏋️';
        constitution.score = 10;
        constitution.modifier = 0;
        constitution.characterCharacteristics = characteristics;
        this.abilityRepository.insert(constitution);

        const intelligence: AbilityEntity = new AbilityEntity();
        intelligence.name = 'Интелект';
        intelligence.abbr = '🎓';
        intelligence.score = 10;
        intelligence.modifier = 0;
        intelligence.characterCharacteristics = characteristics;
        this.abilityRepository.insert(intelligence);

        const wisdom: AbilityEntity = new AbilityEntity();
        wisdom.name = 'Мудрость';
        wisdom.abbr = '📚';
        wisdom.score = 10;
        wisdom.modifier = 0;
        wisdom.characterCharacteristics = characteristics;
        this.abilityRepository.insert(wisdom);

        const charisma: AbilityEntity = new AbilityEntity();
        charisma.name = 'Харизма';
        charisma.abbr = '🗣';
        charisma.score = 10;
        charisma.modifier = 0;
        charisma.characterCharacteristics = characteristics;
        this.abilityRepository.insert(charisma);

        character.characterCharacteristics.abilites = [
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma,
        ];

        const armorClass = new ArmorClassEntity();
        armorClass.name = 'Базовый';
        armorClass.base = 10;
       // armorClass.modifier = [dexterity.modifier];
        armorClass.bonus = 0;
        this.armorClassRepository.insert(armorClass);
        /**
         * класс защиты
         */
        character.characterCharacteristics.armorClasses = [armorClass];
        /**
         * Создание инвенторя
         */
        const inventory = new InventoryEntity();
        this.inventoryRepository.insert(inventory);
        character.inventory = inventory;

        /**
         * Создание истории персонажа
         */
        character.background = new BackgroundEnity();
        character.background.name = dto.name;
        const races = await this.raceRepository.find({
            where: {
                id: dto.raceId,
            },
        });
        if (races.length == 0) {
            return;
        }
        character.background.race = races[0];
        const states = await this.stateEntity.find({
            where: {
                id: dto.countryId,
            },
        });
        if (states.length == 0) {
            return;
        }
        character.background.state = states[0];
        this.backgroundRepository.insert(character.background);
        this.characterRepository.insert(character);
        //  character.background.race = dto.raceId;
    }
}
