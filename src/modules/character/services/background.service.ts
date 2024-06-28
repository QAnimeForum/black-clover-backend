import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { BackgroundEntity } from '../entity/background.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
import { CharacterEntity } from '../entity/character.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class UpdateAppearanceDto {
    telegramId: string;
    appearance: string;
}
export class UpdateNameDto {
    telegramId: string;
    name: string;
}

export class UpdateGoalsDto {
    telegramId: string;
    goals: string;
}

export class UpdateHistoryDto {
    telegramId: string;
    history: string;
}

export class UpdateHobbiesDto {
    telegramId: string;
    hobbies: string;
}

export class UpdateWeaknessDto {
    weaknesses: string;
    telegramId: string;
}
export class UpdateWorldviewDto {
    telegramId: string;
    worldview: string;
}

export class UpdateCharacterTraitsDto {
    telegramId: string;
    characterTraits: string;
}

export class UpdateCharacterIdealsDto {
    telegramId: string;
    ideals: string;
}

@Injectable()
export class BackgroundService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject(GrimoireService) readonly grimoireService: GrimoireService,
        @InjectRepository(BackgroundEntity)
        private readonly backgroundRepository: Repository<BackgroundEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async createBackground(
        dto: CreatePlayableCharacterDto,
        transactionalEntityManager: EntityManager
    ) {
        const background = new BackgroundEntity();
        background.name = dto.name;
        background.age = dto.age;
        background.sex = dto.sex;
        background.history = 'не заполнено';
        background.hobbies = 'не заполнено';
        background.goals = 'не заполнено';
        background.worldview = 'не заполнено';
        background.characterTraits = 'не заполнено';
        background.ideals = 'не заполнено';
        background.attachments = 'не заполнено';
        background.weaknesses = 'не заполнено';
        background.quotes = [];
        background.appearance = 'не заполнено';
        background.raceId = dto.raceId;
        background.stateId = dto.stateId;
        transactionalEntityManager.save(background);
        return background;
        /**
 *          (
            await this.backgroundRepository.insert({
                name: dto.name,
                raceId: races[0],
                height: 0,
                sex: dto.sex,
                age: dto.age,
                state: states[0],
            })
        ).raw[0];
 */
    }
    async findBackgroundByCharacterId(
        characterId: string
    ): Promise<BackgroundEntity> {
        /**
       *       return grimoire;
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
       */
        return await this.backgroundRepository
            .createQueryBuilder('background')
            .innerJoinAndSelect(
                'background.character',
                'charcter',
                'character.id = :characterId',
                { characterId: characterId }
            )
            .getOne();
    }

    async findBackgroundById(backgroundId: string): Promise<BackgroundEntity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }

    async updateUserAppearance(dto: UpdateAppearanceDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ appearance: dto.appearance })
            .where('id = :id', { id: backgroundId })
            .execute();
    }
    async updateUserName(dto: UpdateNameDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ name: dto.name })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateUserGoals(dto: UpdateGoalsDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ goals: dto.goals })
            .where('id = :id', { id: backgroundId })
            .execute();
    }
    async updateUserHistory(dto: UpdateHistoryDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ history: dto.history })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateUserHobbies(dto: UpdateHobbiesDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ hobbies: dto.hobbies })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateUserWeakness(dto: UpdateWeaknessDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ weaknesses: dto.weaknesses })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateWorldwiew(dto: UpdateWorldviewDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ worldview: dto.worldview })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateCharacterTraits(dto: UpdateCharacterTraitsDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ characterTraits: dto.characterTraits })
            .where('id = :id', { id: backgroundId })
            .execute();
    }

    async updateIdeals(dto: UpdateCharacterIdealsDto) {
        const userEntity = await this.userRepository.findOne({
            where: {
                tgUserId: dto.telegramId,
            },
            relations: {
                character: true,
            },
        });
        const backgroundId = userEntity.character.backgroundId;
        return await this.connection
            .createQueryBuilder()
            .update(BackgroundEntity)
            .set({ ideals: dto.ideals })
            .where('id = :id', { id: backgroundId })
            .execute();
    }
}
