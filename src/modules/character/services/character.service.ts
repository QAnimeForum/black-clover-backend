import { Inject, Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BackgroundEntity } from '../entity/background.entity';
import { RaceEntity } from '../../race/entity/race.entity';
import { StateEntity } from '../../map/enitity/state.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import { InventoryEntity } from '../entity/inventory.entity';
import { GetCharacteristicsDto } from '../dto/query-character-info.dto';
import { GrimoireEntity } from '../../grimoire/entity/grimoire.entity';
import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ProficiencyEntity } from '../entity/proficiency.entity';
import { AbilityEntity } from '../entity/ability.entity';
import { ArmorClassEntity } from '../entity/armor.class.entity';
import { SpeedEntity } from '../entity/speed.entity';
import { ArmorEntity } from '../../items/entity/armor.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { WalletEntity } from '../../money/entity/wallet.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CashEntity } from '../../money/entity/cash.entity';
import { CharacterNameEditDto } from '../dto/character.name-edit.dto';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
import { CharacteristicService } from './characteristics.service';
import { BackgroundService } from './background.service';
import { MapService } from 'src/modules/map/service/map.service';
import { WalletService } from './wallet.service';

@Injectable()
export class CharacterService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject() readonly grimoireService: GrimoireService,
        @Inject() readonly inventoryService: InventoryService,
        @Inject() readonly characteristicsService: CharacteristicService,
        @Inject() readonly backgroundService: BackgroundService,
        @Inject() readonly mapService: MapService,
        @Inject() readonly walletService: WalletService,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(BackgroundEntity)
        private readonly backgroundRepository: Repository<BackgroundEntity>,
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
        let character: CharacterEntity;
        this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                /**
                 * Создание инвенторя
                 */
                const inventory =
                    await this.inventoryService.createInventory(
                        transactionManager
                    );
                /**
                 * Создание истории персонажа
                 */
                const coverSymbol = await this.mapService.findStateSymbolById(
                    dto.stateId
                );
                const grimoire = await this.grimoireService.createGrimoire({
                    magicName: dto.magic,
                    coverSymbol: coverSymbol,
                });
                const background =
                    await this.backgroundService.createBackground(
                        dto,
                        transactionManager
                    );
                const characteristics =
                    await this.characteristicsService.createCharacteristics(
                        transactionManager
                    );
                const wallet =
                    await this.walletService.creeateWallet(transactionManager);
                character = new CharacterEntity();
                character.type = ENUM_CHARCACTER_TYPE.PC;
                character.background = background;
                character.characterCharacteristics = characteristics;
                character.grimoire = grimoire;
                character.inventory = inventory;
                character.wallet = wallet;
            }
        );
        return character;
    }

    getCharacterBacgroundByTgId(telegramId: string) {
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

    async getCharacterIdByTgId(telegramId: string) {
        return (
            await this.userRepository.findOne({
                where: {
                    tgUserId: telegramId,
                },
                relations: {
                    character: true,
                },
            })
        ).character;
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

    async getBackgroundById(backgroundId: string): Promise<BackgroundEntity> {
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

    findCharacteristicsB(dto: GetCharacteristicsDto) {
        return this.characterRepository.findBy({
            id: dto.charactristicsId,
        });
    }

    findCharacterById(characterId: string) {
        return this.characterRepository.findOneBy({
            id: characterId,
        });
    }

    async findFullCharacterInfoByTgId(tgId: string): Promise<CharacterEntity> {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tgId,
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
        const character = (await this.getCharacterBacgroundByTgId(dto.id))
            .character;
        character.background.name = dto.name;
        this.backgroundRepository.save(character.background);
    }

    async getStateByTgId(tg_id: string) {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    background: {
                        state: true,
                    },
                },
            },
        });
        return entity.character.background.state;
    }
}
