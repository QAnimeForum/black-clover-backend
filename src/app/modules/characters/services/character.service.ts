import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterType } from '../constants/character.type.enum';
import { BackgroundEnity } from '../entity/background.entity';
import { RaceEntity } from '../entity/race.entity';
import { StateEntity } from '../../map/enitity/state.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import { InventoryEntity } from '../entity/inventory.entity';
import { ArmorEntity } from '../../business/entity/armor.entity';
import { SpellEntity } from '../entity/spell.entity';
import {
    GetCharacterInfoDto,
    GetCharacteristicsDto,
    GetSpellsDto,
} from '../dto/query-character-info.dto';
import { GrimoireEntity } from '../entity/grimoire.entity';
import { CreateRaceDto } from '../dto/create-race.dto';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ProficiencyEntity } from '../entity/proficiency.entity';
import { AbilityEntity } from '../entity/ability.entity';
import { ArmorClassEntity } from '../entity/armor.class.entity';
import { SpeedEntity } from '../entity/speed.entity';
import { CardSymbolsEnum } from '../constants/card.symbol.enum';
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
        @InjectRepository(AbilityEntity)
        private readonly abilityRepository: Repository<AbilityEntity>,
        @InjectRepository(ArmorEntity)
        private readonly armorRepository: Repository<ArmorEntity>,
        @InjectRepository(ArmorClassEntity)
        private readonly armorClassRepository: Repository<ArmorClassEntity>,
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(SpellEntity)
        private readonly spellRepository: Repository<SpellEntity>,
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(StateEntity)
        private readonly stateEntity: Repository<StateEntity>,
        @InjectRepository(SpeedEntity)
        private readonly speedEntity: Repository<SpeedEntity>
    ) {}
    async createPlayableCharacterDto(dto: CreatePlayableCharacterDto) {
        const races = await this.raceRepository.find({
            where: {
                id: dto.raceId,
            },
        });
        if (races.length == 0) {
            return;
        }
        const states = await this.stateEntity.find({
            where: {
                id: dto.countryId,
            },
        });
        if (states.length == 0) {
            return;
        }

        const backgroundEntity = (
            await this.backgroundRepository.insert({
                name: dto.name,
                race: races[0],
                height: 0,
                age: 0,
                state: states[0],
            })
        ).raw[0];

        /**
         * Создание инвенторя
         */
        const inventoryEntity = (await this.inventoryRepository.insert({}))
            .raw[0];
        console.log(inventoryEntity);
        /**
         * Создание истории персонажа
         */

        const grimoireEntity = (
            await this.grimoireRepository.insert({
                magicName: 'не выбрана',
                coverSymbol: CardSymbolsEnum.CLOVER,
                magicColor: 'не выбран',
            })
        ).raw[0];
        const proficiency = (
            await this.proficiencyRepository.insert({
                level: 1,
                extraBonus: 0,
            })
        ).raw[0];

        // const strength: AbilityEntity = new AbilityEntity();
        const strengthEntity = (
            await this.abilityRepository.insert({
                name: 'Сила',
                abbr: '💪',
                score: 10,
                modifier: 0,
                //   characterCharacteristics: characteristitcsEntity,
            })
        ).raw[0];

        const dexterityEntity = (
            await this.abilityRepository.insert({
                name: 'Ловкость',
                abbr: '🏃',
                score: 10,
                modifier: 0,
            })
        ).raw[0];

        const constitutionEntity = (
            await this.abilityRepository.insert({
                name: 'Телосложение',
                abbr: '🏋️',
                score: 10,
                modifier: 0,
            })
        ).raw[0];

        const intelligenceEntity = (
            await this.abilityRepository.insert({
                name: 'Интеллект',
                abbr: '🎓',
                score: 10,
                modifier: 0,
            })
        ).raw[0];

        const wisdomEntity = (
            await this.abilityRepository.insert({
                name: 'Мудрость',
                abbr: '📚',
                score: 10,
                modifier: 0,
            })
        ).raw[0];

        const charismaEntity = (
            await this.abilityRepository.insert({
                name: 'Харизма',
                abbr: '🗣',
                score: 10,
                modifier: 0,
            })
        ).raw[0];
        /**
         * класс защиты
         */
        const armorClassEntity = (
            await this.armorClassRepository.insert({
                base: 10,
                bonus: 0,
            })
        ).raw[0];
        const characteristitcsEntity = (
            await this.characteristicsRepository.insert({
                currentHealth: 500,
                maxHealth: 500,
                currentLevel: 1,
                maxLevel: 20,
                proficiency: proficiency,
                strength: strengthEntity,
                dexterity: dexterityEntity,
                constitution: constitutionEntity,
                intelligence: intelligenceEntity,
                wisdom: wisdomEntity,
                charisma: charismaEntity,
                armorClass: armorClassEntity,
            })
        ).raw[0];
        return this.characterRepository.insert({
            type: CharacterType.PC,
            background: backgroundEntity,
            characterCharacteristics: characteristitcsEntity,
            grimoire: grimoireEntity,
            inventory: inventoryEntity,
        });
        //  character.background.race = dto.raceId;
    }

    getCharacterInfo(dto: GetCharacterInfoDto) {
        return this.characterRepository.findBy({
            id: dto.characterId,
        });
    }

    async findAllRaces(
        dto: PaginationListDto
    ): Promise<[RaceEntity[], number]> {
        const [entities, total] = await this.raceRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
        });
        return [entities, total];
    }

    async raceExistByName(name: string): Promise<boolean> {
        const entity = await this.raceRepository.findOneBy({
            name: name,
        });
        return entity ? false : true;
    }

    async getCharacterById(characerId: string): Promise<CharacterEntity> {
        const entity = await this.characterRepository.findOne({
            where: {
                id: characerId,
            },
            relations: {
                background: true,
                characterCharacteristics: true,
                grimoire: true,
                inventory: true,
            },
        });
        return entity;
    }

    async getRaceById(raceId: string): Promise<RaceEntity> {
        const entity = await this.raceRepository.findOneBy({
            id: raceId,
        });
        return entity;
    }

    async getBackgroundById(backgroundId: string): Promise<BackgroundEnity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
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

    async getGrimoireById(backgroundId: string): Promise<BackgroundEnity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }

    async getInventoryById(backgroundId: string): Promise<BackgroundEnity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }
    createrRace(dto: CreateRaceDto) {
        return this.raceRepository.insert(dto);
    }
    findCharacteristics(dto: GetCharacteristicsDto) {
        return this.characterRepository.findBy({
            id: dto.charactristicsId,
        });
    }

    findSpells(dto: GetSpellsDto) {
        return this.spellRepository.findBy({
            id: dto.grimoireId,
        });
    }
}
