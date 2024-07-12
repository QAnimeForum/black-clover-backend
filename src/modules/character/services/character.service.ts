import { Inject, Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BackgroundEntity } from '../entity/background.entity';
import { RaceEntity } from '../../race/entity/race.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';

import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { CharacterNameEditDto } from '../dto/character.name-edit.dto';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
import { CharacteristicService } from './characteristics.service';
import { BackgroundService } from './background.service';
import { MapService } from 'src/modules/map/service/map.service';
import { getFileMimeType } from 'src/utils/utils';
import { join } from 'path';
import fs from 'fs';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
import { WalletService } from 'src/modules/money/wallet.service';
import { EquipmentEntity } from 'src/modules/items/entity/equipment.entity';
import { GrimoireEntity } from 'src/modules/grimoire/entity/grimoire.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class CharacterService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject(GrimoireService) readonly grimoireService: GrimoireService,
        @Inject(InventoryService)
        readonly inventoryService: InventoryService,
        @Inject(CharacteristicService)
        readonly characteristicsService: CharacteristicService,
        @Inject(BackgroundService)
        readonly backgroundService: BackgroundService,
        @Inject(MapService) readonly mapService: MapService,
        @Inject(WalletService) readonly walletService: WalletService,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(BackgroundEntity)
        private readonly backgroundRepository: Repository<BackgroundEntity>,
        @InjectRepository(CharacterCharacteristicsEntity)
        private readonly characteristicsRepository: Repository<CharacterCharacteristicsEntity>,
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(EquipmentEntity)
        private readonly equipmentRepository: Repository<EquipmentEntity>
    ) {}
    public findAll(query: PaginateQuery): Promise<Paginated<CharacterEntity>> {
        return paginate(query, this.characterRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: [
                'id',
                'background',
                'background.id',
                'background.name',
                'background.state',
                'background.state.id',
                'background.state.name',
                'background.race',
                'background.race.id',
                'background.race.name',
            ],
            select: [
                'id',
                'background',
                'background.name',
                'background.race',
                'background.state',
                'user',
                'user.tgUserId',
                'grimoire',
                'grimoire.id',
                'grimoire.magicName',
            ],
            relations: {
                background: true,
                user: true,
                grimoire: true,
            },
        });
    }
    async createPlayableCharacter(
        transactionManager: EntityManager,
        dto: CreatePlayableCharacterDto,
        userId: string
    ) {
        /**
         * Создание инвенторя
         */
        const inventory =
            await this.inventoryService.createInventory(transactionManager);

        const equpmentEntity = new EquipmentEntity();
        await this.equipmentRepository.save(equpmentEntity);
        /**
         * Создание истории персонажа
         */
        /*   const coverSymbol = await this.mapService.findStateSymbolById(
            dto.stateId
        );
        const grimoire = await this.grimoireService.createGrimoire({
            magicName: 'не выбран',
            coverSymbol: coverSymbol,
        });*/
        const background = await this.backgroundService.createBackground(
            dto,
            transactionManager
        );
        const characteristics =
            await this.characteristicsService.createCharacteristics(
                transactionManager,
                dto.raceId,
                dto.stateId
            );
        const wallet =
            await this.walletService.creeateWallet(transactionManager);

        const character = new CharacterEntity();
        character.type = ENUM_CHARCACTER_TYPE.PC;
        character.avatar = KNIGHT_IMAGE_PATH;
        //    character.avatar = await this.copyDefaultAvatar();
        character.backgroundId = background.id;
        character.characterCharacteristicsId = characteristics.id;
        //   character.grimoireId = grimoire.id;
        character.inventoryId = inventory.id;
        character.equipment = equpmentEntity;
        character.walletId = wallet.id;
        character.prodigy = false;
        character.userId = userId;
        await transactionManager.save(character);
        return character;
    }

    async copyDefaultAvatar() {
        const fileMimeType = getFileMimeType(KNIGHT_IMAGE_PATH);
        const fileName = `avatar.${fileMimeType}`;
        const relativeFilePath = join('avatar', fileName);
        const absoluteFilePath = join(
            process.env.APP_API_URL,
            relativeFilePath
        );
        console.log(KNIGHT_IMAGE_PATH, absoluteFilePath);
        // File destination.txt will be created or overwritten by default.
        // fs.copyFileSync(KNIGHT_IMAGE_PATH, absoluteFilePath);
        fs.readFile(KNIGHT_IMAGE_PATH, function (err, data) {
            if (err) throw err;
            fs.writeFile(absoluteFilePath, data, 'base64', function (err) {
                if (err) throw err;
                console.log("It's saved!");
            });
        });
        return fileName;
    }

    updateCharacter(character: CharacterEntity) {
        return this.characterRepository.save(character);
    }
    updateGrimoire(characterId: string, grimoireId: string) {
        return this.connection
            .createQueryBuilder()
            .update(CharacterEntity)
            .set({ grimoireId: grimoireId })
            .where('id = :id', { id: characterId })
            .execute();
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

    async findCharacterByTgId(tgId: string) {
        return this.characterRepository.findOne({
            where: {
                user: {
                    tgUserId: tgId,
                },
            },
            relations: {
                background: {
                    state: true,
                },
            },
        });
    }
    findCharacterById(characterId: string) {
        return this.characterRepository.findOne({
            where: {
                id: characterId,
            },
            relations: {
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
        });
    }

    async findTgIdByCharacterId(characterId: string) {
        const character = await this.characterRepository.findOne({
            where: {
                id: characterId,
            },
            relations: {
                user: true,
            },
        });
        return character.user.tgUserId;
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
                    wallet: true,
                },
            },
        });
        return entity.character;
    }

    async getInventoryByCharacter(tgId: string) {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tgId,
            },
            relations: {
                character: {
                    inventory: {
                        /*   weapons: true,
                        armor: true,
                        toolKits: true,
                        gears: true,
                        vehicles: true,*/
                    },
                },
            },
        });
        return entity;
    }
    async changeCharacterName(dto: CharacterNameEditDto) {
        const character = (await this.getCharacterBacgroundByTgId(dto.tgId))
            .character;
        character.background.name = dto.name;
        this.backgroundRepository.save(character.background);
    }

    async getStateByTgId(tgId: string) {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tgId,
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
