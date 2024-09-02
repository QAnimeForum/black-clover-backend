import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SquadEntity } from '../entity/squad.entity';
import { ArmedForcesEntity } from '../entity/armed.forces.entity';
import { SquadMemberEntity } from '../entity/squad.member.entity';
import { SquadCreateDto } from '../dto/squad.create.dto';
import { ArmedForcesCreateDto } from '../dto/armed.forces.create.dto';
import { SquadRankCreateDto } from '../dto/squad.rank.create.dto';
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
import { MoneyEntity } from 'src/modules/money/entity/money.entity';
import { KNIGHT_IMAGE_PATH } from 'src/modules/tg-bot/constants/images';

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

    public findRequestById(id: string) {
        return this.armedForcesRequestRepository.findOne({
            where: {
                id,
            },
            relations: {
                armedForces: true,
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
                status: [FilterOperator.EQ, FilterSuffix.NOT],
                'armedForces.id': true,
            },
        });
    }

    async changeRank(rankId: string, memberId: string) {
        console.log(rankId, memberId);
        let result = null;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const rank = await transactionalEntityManager.findOne(
                    ArmedForcesRankEntity,
                    {
                        where: {
                            id: rankId,
                        },
                    }
                );
                const member = await transactionalEntityManager.findOne(
                    ArmedForcesMemberEntity,
                    {
                        where: {
                            id: memberId,
                        },
                    }
                );
                console.log(member);
                member.rank = rank;
                member.rankId = rankId;

                result = await transactionalEntityManager.save(member);
            }
        );
        return result;
    }
    /**
    * 
    * @param id  public async acceptMember(
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

        while (rank.children.length > 0) {
            rank = rank.children[0];
        }
        member.rank = rank;
        member.rankId = rank.id;

        await this.armedForcesMemberRepository.insert(member);
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
    * @returns 
    */

    public async acceptRequest(requestId: string) {
        let member: ArmedForcesMemberEntity | null = null;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const request = await transactionalEntityManager.findOne(
                    ArmedForcesRequestEntity,
                    {
                        where: {
                            id: requestId,
                        },
                        relations: {
                            armedForces: true,
                        },
                    }
                );
                const isCharacterMember =
                    await transactionalEntityManager.exists(
                        ArmedForcesMemberEntity,
                        {
                            where: {
                                characterId: request.characterId,
                            },
                        }
                    );

                if (!isCharacterMember) {
                    request.status = ENUM_ARMED_FORCES_REQUEST.ACCEPTED;
                    await transactionalEntityManager.save(request);
                    /* await transactionalEntityManager
                        .createQueryBuilder()
                        .update(this.armedForcesRequestRepository)
                        .set({
                            status: ENUM_ARMED_FORCES_REQUEST.ACCEPTED.toString(),
                        })
                        .where('id = :id', { id: `${requestId}` })
                        .execute();*/

                    let ranks = await this.findRanksByArmedForces(
                        request.armedForces.id
                    );

                    member = new ArmedForcesMemberEntity();
                    member.armedForcesId = request.forcesId;
                    member.characterId = request.characterId;

                    while (ranks.children.length > 0) {
                        ranks = ranks.children[0];
                    }
                    member.rank = ranks;
                    member.rankId = ranks.id;

                    await transactionalEntityManager.save(member);
                } else {
                    request.status = ENUM_ARMED_FORCES_REQUEST.REJECTED;
                    await transactionalEntityManager.save(request);
                }
            }
        );
        return member;
    }

    public async rejectRequest(requestId: string) {
        const isChanged = false;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const request = await transactionalEntityManager.findOne(
                    ArmedForcesRequestEntity,
                    {
                        where: {
                            id: requestId,
                        },
                        relations: {
                            armedForces: true,
                        },
                    }
                );
                request.status = ENUM_ARMED_FORCES_REQUEST.ACCEPTED;
                await transactionalEntityManager.save(request);
            }
        );
        return isChanged;
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
        squad.image = '/default/default-knight.jpg';
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
            select: ['id', 'name', 'armorForcesId'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                armorForcesId: true,
            },
        });
    }

    async findRanksByArmedForces(armedForceId: string) {
        /*return await this.rankRepository.find({
            where: {
                armorForcesId: armedForceId,
        
            },
            relations: {
                salary: true,
            },
        });*/
        const entities = await this.rankRepository.findRoots({
            relations: ['salary'],
        });
        const entity = entities.find(
            (item) => item.armorForcesId == armedForceId
        );
        return await this.rankRepository.findDescendantsTree(entity, {
            relations: ['salary'],
        });
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

    findArmedForcesMember(memberId: string) {
        return this.armedForcesMemberRepository.findOne({
            where: {
                id: memberId,
            },
            relations: {
                rank: true,
            },
        });
    }

    findArmedForcesMemberByTgId(tgId: string) {
        return this.armedForcesMemberRepository.findOne({
            where: {
                character: {
                    user: {
                        tgUserId: tgId,
                    },
                },
            },
            relations: {
                rank: true,
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
    ): Promise<Paginated<ArmedForcesMemberEntity>> {
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
            select: ['id', 'name', 'state', 'state.name'],
            filterableColumns: {
                name: [FilterOperator.EQ, FilterSuffix.NOT],
                forces_id: true,
            },
            relations: ['state'],
        });
    }
    findArmedForcesById(id: string): Promise<ArmedForcesEntity | null> {
        return this.armedForcesRepository.findOne({
            where: { id },
            relations: {
                state: true,
            },
        });
    }

    findArmedForcesByState(
        state: StateEntity
    ): Promise<ArmedForcesEntity | null> {
        return this.armedForcesRepository.findOneBy({ stateId: state.id });
    }
    async createArmedForces(dto: ArmedForcesCreateDto) {
        const armedForces = new ArmedForcesEntity();
        armedForces.name = dto.name;
        armedForces.description = dto.description;
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

    async isUserHasAnyRequest(tgId: string): Promise<boolean> {
        //  `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${dto.tgId}`

        return this.armedForcesRequestRepository.exists({
            where: {
                tgUserId: tgId,
                status: ENUM_ARMED_FORCES_REQUEST.PENDING,
            },
        });
    }

    async isUserHasRequest(
        tgId: string,
        armedForceId: string
    ): Promise<boolean> {
        //  `select wallet.* from wallet JOIN character ON wallet.id = character.wallet_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${dto.tgId}`

        return this.armedForcesRequestRepository.exists({
            where: {
                tgUserId: tgId,
                forcesId: armedForceId,
                status: ENUM_ARMED_FORCES_REQUEST.PENDING,
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
        return this.squadMemberRepository.exists({
            where: {
                armedForcesMember: {
                    characterId: character.id,
                },
            },
        });
    }

    async isUserSquadMemberRequest(
        character: CharacterEntity
    ): Promise<boolean> {
        const isRequestExists = this.armedForcesRequestRepository.exists({
            where: {
                character: character,
                status: ENUM_ARMED_FORCES_REQUEST.PENDING,
            },
        });
        return isRequestExists;
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

    async addStar(memberId: string) {
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const member = await transactionalEntityManager.findOne(
                    ArmedForcesMemberEntity,
                    {
                        where: {
                            id: memberId,
                        },
                        relations: {
                            rank: true,
                        },
                    }
                );
                member.stars += 1;
                const parentsTree = await transactionalEntityManager
                    .getTreeRepository(ArmedForcesRankEntity)
                    .findAncestorsTree(member.rank);
                const parentRank = parentsTree.parent;
                if (parentRank && parentRank.star <= member.stars) {
                    member.rank = parentRank;
                }
                await transactionalEntityManager.save(member);
            }
        );
    }
    async removeStar(memberId: string) {
        let isRemoved = false;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const member = await transactionalEntityManager.findOne(
                    ArmedForcesMemberEntity,
                    {
                        where: {
                            id: memberId,
                        },
                        relations: {
                            rank: true,
                        },
                    }
                );
                if (member.stars > 0) {
                    member.stars -= 1;
                    isRemoved = true;
                }

                const parentsTree = await transactionalEntityManager
                    .getTreeRepository(ArmedForcesRankEntity)
                    .findDescendantsTree(member.rank, { depth: 1 });

                const childrenRank = parentsTree.children;
                if (
                    childrenRank.length > 0 &&
                    childrenRank[0].star <= member.stars
                ) {
                    member.rank = childrenRank[0];
                }
                await transactionalEntityManager.save(member);
            }
        );
        return isRemoved;
    }

    async fire(memberId: string) {
        return await this.armedForcesMemberRepository.delete(memberId);
    }

}