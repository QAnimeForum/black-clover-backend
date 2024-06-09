import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SquadEntity } from '../entity/squad.entity';
import { ArmedForcesEntity } from '../entity/armed.forces.entity';
import { SquadMemberEntity } from '../entity/squad.member.entity';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { SquadCreateDto } from '../dto/squad.create.dto';
import { ArmedForcesCreateDto } from '../dto/armed.forces.create.dto';
import { SquadRankCreateDto } from '../dto/squad.rank.create.dto';
import { SalaryEntity } from '../../money/entity/amount.entity';
import { SquadMemberCreateDto } from '../dto/squad.member.create.dto';
import { CharacterEntity } from '../../character/entity/character.entity';
import { StateEntity } from 'src/modules/map/enitity/state.entity';
import { ArmedForcesRequestDto } from '../dto/armed.forces.request.dto';
import { ArmedForcesRequestEntity } from '../entity/armed.forces.request.entity';
import { ENUM_ARMED_FORCES_REQUEST } from '../constants/armed.forces.request.list';
import { CharacterService } from 'src/modules/character/services/character.service';
import {
    FilterOperator,
    FilterSuffix,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { ArmedForcesRankEntity } from '../entity/armed.forces.rank.entity';
import { ArmedForcesMemberEntity } from '../entity/armed.forces.member.entity';
import { ArmedForcesMemberCreateDto } from '../dto/armed.forces.member.create.dto';

@Injectable()
export class SquadsService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(SquadEntity)
        private readonly squadRepository: Repository<SquadEntity>,
        @InjectRepository(ArmedForcesEntity)
        private readonly armedForcesRepository: Repository<ArmedForcesEntity>,
        @InjectRepository(ArmedForcesRankEntity)
        private readonly rankRepository: TreeRepository<ArmedForcesRankEntity>,
        @InjectRepository(SquadMemberEntity)
        private readonly squadMemberRepository: Repository<SquadMemberEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(ArmedForcesRequestEntity)
        private readonly armedForcesRequestRepository: Repository<ArmedForcesRequestEntity>,
        @InjectRepository(ArmedForcesMemberEntity)
        private readonly armedForcesMemberRepository: Repository<ArmedForcesMemberEntity>,
        @Inject(CharacterService)
        private readonly characterService: CharacterService
    ) {}

    public findAllSquads(
        query: PaginateQuery
        //   armedForcesId: string
    ): Promise<Paginated<SquadEntity>> {
        /*  const queryBuilder = this.squadRepository
            .createQueryBuilder('squads')
            .leftJoinAndSelect('squads.armed_forces_id', 'armed_forces')
            .where('squads.armed_forces_id = :armedForcesId', {
                armedForcesId,
            });*/

        return paginate(query, this.squadRepository, {
            sortableColumns: ['id', 'name', 'description'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                forces_id: true,
            },
        });
    }

    public findAllRequests(
        query: PaginateQuery
    ): Promise<Paginated<ArmedForcesRequestEntity>> {
        return paginate(query, this.armedForcesRequestRepository, {
            relations: {
                armedForces: true,
                character: {
                    background: true,
                    grimoire: true,
                },
            },
            sortableColumns: ['id', 'armedForces.id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['armedForces.id'],
            select: [
                'id',
                'armedForces.id',
                'character.id',
                'character.background.name',
                'character.grimoire.magicName',
                'status',
                'tgUsername',
                'tgUserId',
            ],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                'armedForces.id': true,
            },
        });
    }

    public async acceptMember(
        character: CharacterEntity,
        armedForces: ArmedForcesEntity,
        tgUserId: number,
        requestStatus: ENUM_ARMED_FORCES_REQUEST
    ) {
        const member = new ArmedForcesMemberEntity();
        member.armedForcesId = armedForces.id;
        member.armedForces = armedForces;
        member.character = character;
        member.characterId = character.id;
        //TODO сделать красивее
        let rank = (await this.rankRepository.findTrees())[0];
        console.log(rank);
        while (rank.children.length > 0) {
            rank = rank.children[0];
        }
        member.rank = rank;
        member.rankId = rank.id;
        console.log(member);
        await this.armedForcesMemberRepository.insert(member);
        //  member.rank = ENUM_MEMB
        this.changeRequestStatus(tgUserId, requestStatus);
    }
    public async changeRequestStatus(
        tgUserId: number,
        requestStatus: ENUM_ARMED_FORCES_REQUEST
    ) {
        await this.connection
            .createQueryBuilder()
            .update(this.armedForcesRequestRepository)
            .set({
                status: requestStatus,
            })
            .where('tgUserId = :tgUserId', { tgUserId: tgUserId })
            .execute();
        return true;
    }
    findSquadById(id: string): Promise<SquadEntity | null> {
        return this.squadRepository.findOneBy({ id });
    }
    membersCount(squadId: string): Promise<number> {
        return this.squadMemberRepository.count({
            where: {
                squad: {
                    id: squadId,
                },
            },
        });
    }
    async createSquad(dto: SquadCreateDto) {
        const forces = await this.findArmedForcesById(dto.forces_id);
        const squad = new SquadEntity();
        squad.name = dto.name;
        squad.description = dto.description;
        squad.armorForces = forces;
        return this.squadRepository.insert(squad);
    }

    async deleteSquad(id: string): Promise<void> {
        await this.squadRepository.delete(id);
    }

    public findAllRanks(
        query: PaginateQuery
    ): Promise<Paginated<ArmedForcesRankEntity>> {
        return paginate(query, this.rankRepository, {
            sortableColumns: ['id', 'name', 'description'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
            },
        });
    }

    async findRanksByArmedForces(
        armedForceId: string
    ): Promise<[ArmedForcesRankEntity[], number]> {
        const [entities, total] = await this.rankRepository.findAndCount({
            where: {
                armorForcesId: armedForceId,
            },
        });
        return [entities, total];
    }
    findRankById(id: string): Promise<ArmedForcesRankEntity | null> {
        return this.rankRepository.findOneBy({ id });
    }
    async createRank(dto: SquadRankCreateDto) {
        const rank = new ArmedForcesRankEntity();
        rank.name = dto.name;
        rank.description = dto.description;
        // rank.salary = new SalaryEntity();
        return this.rankRepository.insert(rank);
    }

    async deleteSquadRank(id: string): Promise<void> {
        await this.rankRepository.delete(id);
    }

    public findAllSquadMembers(
        query: PaginateQuery
    ): Promise<Paginated<SquadMemberEntity>> {
        return paginate(query, this.squadMemberRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['id'],
            select: ['id', 'name'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
            },
        });
    }

    findSquadMemberById(id: string): Promise<SquadMemberEntity | null> {
        return this.squadMemberRepository.findOneBy({ id });
    }
    async createSquadMember(dto: SquadMemberCreateDto) {
        //  const rank = await this.findRankById(dto.rank_id);
        /* const character = await this.characterRepository.findOneBy({
            id: dto.character_id,
        });*/
        const squad = await this.findSquadById(dto.squad_id);
        const member = new SquadMemberEntity();
        // member.rank = rank;
        //  member.character = character;
        member.squad = squad;
        return this.squadMemberRepository.insert(member);
    }

    async createArmedForcesMember(dto: ArmedForcesMemberCreateDto) {
        const rank = await this.findRankById(dto.rank_id);
        const character = await this.characterRepository.findOneBy({
            id: dto.character_id,
        });
        const armedForces = await this.armedForcesRepository.findOneBy({
            id: dto.armed_forces_id,
        });
        const member = new ArmedForcesMemberEntity();
        member.rank = rank;
        member.character = character;
        member.armedForces = armedForces;
        return this.squadMemberRepository.insert(member);
    }

    async deleteSquadMember(id: string): Promise<void> {
        await this.squadMemberRepository.delete(id);
    }

    async findAllArmedForcesMembers(
        query: PaginateQuery
    ): Promise<Paginated<any>> {
        return paginate(query, this.armedForcesMemberRepository, {
            sortableColumns: ['id', 'character'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['rank.name'],
            relations: [
                'character',
                'character.background',
                'character.grimoire',
                'rank',
            ],
            select: [
                'id',
                'character',
                'armedForcesId',
                'rank.name',
                'character.id',
                'character.grimoire.magicName',
                'character.background',
                'character.background.name',
            ],
            filterableColumns: {
                armedForcesId: true,
            },
        });
    }
    async findAllArmedForces(
        query: PaginateQuery
    ): Promise<Paginated<ArmedForcesEntity>> {
        return paginate(query, this.armedForcesRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['id', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                forces_id: true,
            },
        });
    }
    findArmedForcesById(id: string): Promise<ArmedForcesEntity | null> {
        return this.armedForcesRepository.findOneBy({ id });
    }

    findArmedForcesByState(
        state: StateEntity
    ): Promise<ArmedForcesEntity | null> {
        return this.armedForcesRepository.findOneBy({ stateId: state.id });
    }
    async createArmedForces(dto: ArmedForcesCreateDto) {
        const armedForces = new ArmedForcesEntity();
        armedForces.name = dto.name;
        armedForces.descripiton = dto.description;
        return this.armedForcesRepository.insert(armedForces);
    }

    async createArmedForcesRequest(dto: ArmedForcesRequestDto) {
        const armedForcesRequest = new ArmedForcesRequestEntity();
        armedForcesRequest.character =
            await this.characterService.findCharacterById(dto.characterId);
        armedForcesRequest.armedForces = await this.findArmedForcesById(
            dto.armedForcesId
        );
        armedForcesRequest.status = ENUM_ARMED_FORCES_REQUEST.PENDING;
        armedForcesRequest.tgUserId = dto.tgUserId;
        armedForcesRequest.tgUsername = dto.tgUsername;
        return this.armedForcesRequestRepository.insert(armedForcesRequest);
    }

    async deleteArmedForce(id: string): Promise<void> {
        await this.armedForcesRepository.delete(id);
    }

    async isUserHadRequest(character: CharacterEntity): Promise<boolean> {
        return this.armedForcesRequestRepository.exists({
            where: {
                character: character,
            },
        });
    }

    async isUserArmedForcesMember(
        character: CharacterEntity
    ): Promise<boolean> {
        return this.armedForcesMemberRepository.exists({
            where: {
                characterId: character.id,
            },
        });
    }
    async isUserSquadMember(character: CharacterEntity): Promise<boolean> {
        return false;
    }

    async isUserSquadMemberRequest(
        character: CharacterEntity
    ): Promise<boolean> {
        return this.armedForcesRequestRepository.exists({
            where: {
                character: character,
            },
        });
    }

    async requestToForces(characterId: string, armedForcesId: string) {
        const armedForces = await this.findArmedForcesById(armedForcesId);
        const character =
            await this.characterService.findCharacterById(characterId);
        return this.armedForcesRequestRepository.insert({
            armedForces: armedForces,
            character: character,
            status: ENUM_ARMED_FORCES_REQUEST.PENDING,
        });
    }
}
