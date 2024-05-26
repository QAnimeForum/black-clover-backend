import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GrimoireService } from 'src/modules/grimoire/services/grimoire.service';
import { BackgroundEntity } from '../entity/background.entity';
import { RaceEntity } from 'src/modules/race/entity/race.entity';
import { StateEntity } from 'src/modules/map/enitity/state.entity';
import { CreatePlayableCharacterDto } from '../dto/create-playable-character.dto';
@Injectable()
export class BackgroundService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject() readonly grimoireService: GrimoireService,
        @InjectRepository(BackgroundEntity)
        private readonly backgroundRepository: Repository<BackgroundEntity>,
        @InjectRepository(RaceEntity)
        private readonly raceRepository: Repository<RaceEntity>,
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>
    ) {}

    async createBackground(
        dto: CreatePlayableCharacterDto,
        transactionalEntityManager: EntityManager
    ) {
        const background = new BackgroundEntity();
        background.name = dto.name;
        background.raceId = dto.raceId;
        background.stateId = dto.stateId;
        background.appearance = '';
        background.history = '';
        background.sex = '';
        background.age = dto.age;
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
