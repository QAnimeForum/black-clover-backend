import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackgroundEnity } from '../entity/background.entity';
import { RaceEntity } from '../../race/entity/race.entity';
import { StateEntity } from '../../map/enitity/state.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import { InventoryEntity } from '../entity/inventory.entity';
import {
    GetCharacterInfoDto,
    GetCharacteristicsDto,
} from '../dto/query-character-info.dto';
import { GrimoireEntity } from '../../grimoire/entity/grimoire.entity';
import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ProficiencyEntity } from '../entity/proficiency.entity';
import { AbilityEntity } from '../entity/ability.entity';
import { ArmorClassEntity } from '../entity/armor.class.entity';
import { SpeedEntity } from '../entity/speed.entity';
import { ArmorEntity } from '../../jobs/business/entity/armor.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { WalletEntity } from '../../money/entity/wallet.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CashEntity } from '../../money/entity/cash.entity';
import { CharacterNameEditDto } from '../dto/character.name-edit.dto';
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
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>,
        @InjectRepository(SpeedEntity)
        private readonly speedEntity: Repository<SpeedEntity>,
        @InjectRepository(WalletEntity)
        private readonly walletRepository: Repository<WalletEntity>,
        @InjectRepository(CashEntity)
        private readonly cashRepository: Repository<CashEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
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
        const states = await this.stateRepository.find({
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
                sex: dto.sex,
                age: dto.age,
                state: states[0],
            })
        ).raw[0];

        /**
         * Создание инвенторя
         */
        const inventoryEntity = (await this.inventoryRepository.insert({}))
            .raw[0];
        /**
         * Создание истории персонажа
         */

        const grimoireEntity = (
            await this.grimoireRepository.insert({
                magicName: 'не выбрана',
                //   coverSymbol: CardSymbolsEnum.CLOVER,
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
                experience: 0,
                maxLevel: 20,
                hunger: 0,
                sanity: 0,
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

        const cashEntity = (
            await this.cashRepository.insert({
                cooper: 0,
                silver: 0,
                eclevtrum: 0,
                gold: 0,
                platinum: 0,
            })
        ).raw[0];
        const wallet = (
            await this.walletRepository.insert({
                cash: cashEntity,
            })
        ).raw[0];
        return this.characterRepository.insert({
            type: ENUM_CHARCACTER_TYPE.PC,
            background: backgroundEntity,
            characterCharacteristics: characteristitcsEntity,
            grimoire: grimoireEntity,
            inventory: inventoryEntity,
            wallet: wallet,
        });
        //  character.background.race = dto.raceId;
    }

    getCharacterInfoByTgId(telegramId: string) {
        return this.userRepository.findOne({
            where: {
                tgUserId: telegramId,
            },
            relations: {
                character: {
                    background: {
                        race: true,
                        state: true,
                    },
                },
            },
        });
    }
    async findBackgroundByTgId(telegramId: string) {
        const user = await this.userRepository.findOne({
            where: {
                tgUserId: telegramId,
            },
            relations: {
                character: {
                    background: {
                        race: true,
                        state: true,
                    },
                },
            },
        });
        return user.character.background;
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

    async getInventoryById(backgroundId: string): Promise<BackgroundEnity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }
    findCharacteristicsB(dto: GetCharacteristicsDto) {
        return this.characterRepository.findBy({
            id: dto.charactristicsId,
        });
    }

    async findFullCharacterInfoByTgId(tg_id: string): Promise<CharacterEntity> {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    grimoire: true,
                    background: {
                        race: true,
                        state: true,
                    },
                    characterCharacteristics: {
                        strength: true,
                        dexterity: true,
                        constitution: true,
                        intelligence: true,
                        wisdom: true,
                        charisma: true,
                        armorClass: true,
                    },
                },
            },
        });
        return entity.character;
    }

    async findChatacterGrimoireByTgId(tg_id: string): Promise<GrimoireEntity> {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    grimoire: true,
                },
            },
        });
        return entity.character.grimoire;
    }
    async getWalletByCharacter(tg_id: string) {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    wallet: {
                        cash: true,
                    },
                },
            },
        });
        return entity;
    }

    async getInventoryByCharacter(tg_id: string) {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    inventory: {
                        weapons: true,
                        armor: true,
                        toolKits: true,
                        gears: true,
                        vehicles: true,
                    },
                },
            },
        });
        return entity;
    }
    async changeCharacterName(dto: CharacterNameEditDto) {
        const character = (await this.getCharacterInfoByTgId(dto.id)).character;
        character.background.name = dto.name;
        this.backgroundRepository.save(character.background);
    }

   
}
