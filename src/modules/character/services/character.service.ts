import { Inject, Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entity/character.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BackgroundEntity } from '../entity/background.entity';
import { RaceEntity } from '../../race/entity/race.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import { GetCharacteristicsDto } from '../dto/query-character-info.dto';
import { CharacterCharacteristicsEntity } from '../entity/character.characteristics.entity';
import { ENUM_CHARCACTER_TYPE } from '../constants/character.type.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { CharacterNameEditDto } from '../dto/character.name-edit.dto';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { InventoryService } from 'src/modules/items/service/inventory.service';
import { CharacteristicService } from './characteristics.service';
import { BackgroundService } from './background.service';
import { MapService } from 'src/modules/map/service/map.service';
import { WalletService } from './wallet.service';
import { getFileMimeType } from 'src/utils/utils';
import { join } from 'path';
import fs from 'fs';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';
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
        private readonly userRepository: Repository<UserEntity>
    ) {}
    async createPlayableCharacterDto(
        transactionManager: EntityManager,
        dto: CreatePlayableCharacterDto
    ) {
        /**
         * Создание инвенторя
         */
        const inventory =
            await this.inventoryService.createInventory(transactionManager);
        /**
         * Создание истории персонажа
         */
        const coverSymbol = await this.mapService.findStateSymbolById(
            dto.stateId
        );
        const grimoire = await this.grimoireService.createGrimoire({
            //      magicName: dto.magic,
            magicName: 'не выбран',
            coverSymbol: coverSymbol,
        });
        const background = await this.backgroundService.createBackground(
            dto,
            transactionManager
        );
        const characteristics =
            await this.characteristicsService.createCharacteristics(
                transactionManager
            );
        const wallet =
            await this.walletService.creeateWallet(transactionManager);

        const inStr = fs.createReadStream('/your/path/to/file');
        const outStr = fs.createWriteStream('/your/path/to/destination');

        inStr.pipe(outStr);
        const character = new CharacterEntity();
        character.type = ENUM_CHARCACTER_TYPE.PC;
        character.avatar = await this.copyDefaultAvatar();
        character.backgroundId = background.id;
        character.characterCharacteristicsId = characteristics.id;
        character.grimoireId = grimoire.id;
        character.inventoryId = inventory.id;
        character.walletId = wallet.id;
        character.prodigy = false;
        await transactionManager.save(character);
        return character;
    }

    async copyDefaultAvatar() {
        const fileMimeType = getFileMimeType(KNIGHT_IMAGE_PATH);
        const fileName = `avatar.${fileMimeType}`;
        const relativeFilePath = join('media/images', fileName);
        const absoluteFilePath = join(
            `${process.env.APP_API_URL}/avatar/`,
            relativeFilePath
        );

        // File destination.txt will be created or overwritten by default.
        fs.copyFile(KNIGHT_IMAGE_PATH, absoluteFilePath, (err) => {
            if (err) throw err;
            console.log('avatar was copied to destination.txt');
        });
        return fileName;
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
