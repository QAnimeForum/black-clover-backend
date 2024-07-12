import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GrimoireEntity } from '../entity/grimoire.entity';
import { GrimoireWorkerEntity } from '../entity/grimoire.worker.entity';
import {
    FilterOperator,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { GrimoireReservationEntity } from '../entity/grimoire.reservation.entity';
import { Ctx } from 'nestjs-telegraf';
@Injectable()
export class GrmoireWorkerService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(GrimoireWorkerEntity)
        private readonly grimoireWorkerRepository: Repository<GrimoireWorkerEntity>,
        @InjectRepository(GrimoireReservationEntity)
        private readonly grimoireReservationRepository: Repository<GrimoireReservationEntity>
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
        return this.grimoireWorkerRepository.remove(worker);
    }
    exists(character: CharacterEntity) {
        return this.grimoireWorkerRepository.exists({
            where: {
                characterId: character.id,
            },
        });
    }
    async isUserWorkerByTgId(tgUserId: number) {
        const workers = await this.connection.query(
            `select grimoire_worker.id from grimoire_worker JOIN character ON grimoire_worker.character_id = character.id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`
        );
        return !(workers.length == 0);
    }

    async findWorkerIdByTgId(tgUserId: number) {
        const workers = await this.connection.query(
            `select grimoire_worker.id from grimoire_worker JOIN character ON grimoire_worker.character_id = character.id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`
        );
        return workers[0].id;
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

    async findWorkerByCharacterId(characterId: string) {
        return this.grimoireWorkerRepository.findOne({
            where: {
                characterId: characterId,
            },
        });
    }

    public createReservation(workerId: string, grimoireId: string) {
        return this.grimoireReservationRepository.insert({
            grimoireWorkerId: workerId,
            grimoireId: grimoireId,
        });
    }

    public deleteReservation(reservationId: string) {
        return this.grimoireReservationRepository.delete({
            id: reservationId,
        });
    }
    public findGrimoireReservations(
        query: PaginateQuery
    ): Promise<Paginated<GrimoireReservationEntity>> {
        return paginate(query, this.grimoireReservationRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['grimoire.createdAt', 'ASC']],
            searchableColumns: ['id'],
            select: [
                'id',
                'grimoire.id',
                'grimoire.magicName',
                'grimoire.createdAt',
            ],
            relations: ['grimoire', 'grimoireWorker'],
            filterableColumns: {
                grimoireWorker: [FilterOperator.EQ],
            },
        });
    }

    async findGrimoireReservationById(reservationId: string) {
        return this.grimoireReservationRepository.findOne({
            where: {
                id: reservationId,
            },
        });
    }
}

export class GrimoireWorkerDto {
    characterId: string;
}
