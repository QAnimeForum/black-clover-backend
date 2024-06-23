import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GrimoireEntity } from '../entity/grimoire.entity';
import { GrimoireWorkerEntity } from '../entity/grimoire.worker.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
@Injectable()
export class GrmoireWorkerService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(GrimoireWorkerEntity)
        private readonly grimoireWorkerRepository: Repository<GrimoireWorkerEntity>
    ) {}

    createGrimoireWorker(dto: GrimoireWorkerDto) {
        const grimoireWorker = new GrimoireWorkerEntity();
        grimoireWorker.characterId = dto.characterId;
        return this.grimoireWorkerRepository.save(grimoireWorker);
    }

    async deleteGrimoireWorker(characterId: string) {
        const worker = await this.grimoireWorkerRepository.findOneBy({
            characterId: characterId,
        });
        return  this.grimoireWorkerRepository.remove(worker);
    }
    exists(character: CharacterEntity) {
        return this.grimoireWorkerRepository.exists({
            where: {
                characterId: character.id,
            },
        });
    }
    public findAllGrimoireWorkers(
        query: PaginateQuery
    ): Promise<Paginated<GrimoireWorkerEntity>> {
        return paginate(query, this.grimoireWorkerRepository, {
            sortableColumns: [
                'id',
                'character',
                'character.background',
                'character.background.name',
                'character.user',
            ],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: [
                'id',
                'character',
                'character.id',
                'character.background',
                'character.background.name',
            ],
            select: [
                'id',
                'character',
                'character.id',
                'character.background',
                'character.background.name',
                'character.user.tgUserId',
            ],
            relations: ['character', 'character.background', 'character.user'],
        });
    }
}

export class GrimoireWorkerDto {
    characterId: string;
}
