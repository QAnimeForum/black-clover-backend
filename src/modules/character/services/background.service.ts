import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { BackgroundEntity } from '../entity/background.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
@Injectable()
export class BackgroundService {
    constructor(
        @Inject(GrimoireService) readonly grimoireService: GrimoireService,
        @InjectRepository(BackgroundEntity)
        private readonly backgroundRepository: Repository<BackgroundEntity>
    ) {}

    async createBackground(
        dto: CreatePlayableCharacterDto,
        transactionalEntityManager: EntityManager
    ) {
        const background = new BackgroundEntity();
        background.name = dto.name;
        background.raceId = dto.raceId;
        background.stateId = dto.stateId;
        background.appearance = 'нет';
        background.history = 'нет';
        background.sex = dto.sex;
        background.age = dto.age;
        background.goals = ['нет цели'];
        background.quotes = [];
        background.hobbies = 'нет хобби';
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
    async getBackgroundByCharacterId(
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
    async getBackgroundById(backgroundId: string): Promise<BackgroundEntity> {
        const entity = await this.backgroundRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }
}
