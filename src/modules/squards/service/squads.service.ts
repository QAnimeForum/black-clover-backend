import { Inject, Injectable } from '@nestjs/common';
import { DataSource, getManager, Repository, TreeRepository } from 'typeorm';
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
    async insertHeartRanks() {
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const salary0 = new MoneyEntity();
                salary0.copper = 0;
                salary0.silver = 0;
                salary0.gold = 0;
                salary0.eclevtrum = 0;
                salary0.platinum = 6;
                await transactionalEntityManager.save(salary0);
                const rank0 = new ArmedForcesRankEntity();
                rank0.name = 'Верховный страж';
                rank0.description = '';
                rank0.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank0.parent = null;
                rank0.star = 140;
                rank0.salary = salary0;
                await transactionalEntityManager.save(rank0);

                const salary1 = new MoneyEntity();
                salary1.copper = 0;
                salary1.silver = 0;
                salary1.gold = 0;
                salary1.eclevtrum = 0;
                salary1.platinum = 6;
                await transactionalEntityManager.save(salary1);
                const rank1 = new ArmedForcesRankEntity();
                rank1.name = 'Духовный страж 1-го уровня';
                rank1.description = '';
                rank1.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank1.parent = rank0;
                rank1.star = 110;
                rank1.salary = salary1;
                await transactionalEntityManager.save(rank1);

                const salary2 = new MoneyEntity();
                salary2.copper = 0;
                salary2.silver = 0;
                salary2.eclevtrum = 0;
                salary2.gold = 8;
                salary2.platinum = 3;
                await transactionalEntityManager.save(salary2);
                const rank2 = new ArmedForcesRankEntity();
                rank2.name = 'Духовный страж 2-го уровня';
                rank2.description = '';
                rank2.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank2.parent = rank1;
                rank2.star = 104;
                rank2.salary = salary2;
                await transactionalEntityManager.save(rank2);

                const salary3 = new MoneyEntity();
                salary3.copper = 0;
                salary3.silver = 0;
                salary3.eclevtrum = 0;
                salary3.gold = 6;
                salary3.platinum = 3;
                await transactionalEntityManager.save(salary3);
                const rank3 = new ArmedForcesRankEntity();
                rank3.name = 'Духовный страж 3-го уровня';
                rank3.description = '';
                rank3.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank3.parent = rank2;
                rank3.star = 96;
                rank3.salary = salary3;
                await transactionalEntityManager.save(rank3);

                const salary4 = new MoneyEntity();
                salary4.copper = 0;
                salary4.silver = 0;
                salary4.eclevtrum = 0;
                salary4.gold = 4;
                salary4.platinum = 3;
                await transactionalEntityManager.save(salary4);
                const rank4 = new ArmedForcesRankEntity();
                rank4.name = 'Духовный страж 4-го уровня';
                rank4.description = '';
                rank4.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank4.parent = rank3;
                rank4.star = 88;
                rank4.salary = salary4;
                await transactionalEntityManager.save(rank4);

                const salary5 = new MoneyEntity();
                salary5.copper = 0;
                salary5.silver = 0;
                salary5.eclevtrum = 0;
                salary5.gold = 2;
                salary5.platinum = 3;
                await transactionalEntityManager.save(salary5);
                const rank5 = new ArmedForcesRankEntity();
                rank5.name = 'Золотой рыцарь Сердца 1-го уровня';
                rank5.description = '';
                rank5.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank5.parent = rank4;
                rank5.star = 75;
                rank5.salary = salary5;
                await transactionalEntityManager.save(rank5);

                const salary6 = new MoneyEntity();
                salary6.copper = 0;
                salary6.silver = 0;
                salary6.eclevtrum = 0;
                salary6.gold = 0;
                salary6.platinum = 3;
                await transactionalEntityManager.save(salary6);
                const rank6 = new ArmedForcesRankEntity();
                rank6.name = 'Золотой рыцарь Сердца 2-го уровня';
                rank6.description = '';
                rank6.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank6.parent = rank5;
                rank6.star = 65;
                rank6.salary = salary6;
                await transactionalEntityManager.save(rank6);

                const salary7 = new MoneyEntity();
                salary7.copper = 0;
                salary7.silver = 0;
                salary7.eclevtrum = 0;
                salary7.gold = 4;
                salary7.platinum = 1;
                await transactionalEntityManager.save(salary7);
                const rank7 = new ArmedForcesRankEntity();
                rank7.name = 'Золотой рыцарь Сердца 3-го уровня';
                rank7.description = '';
                rank7.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank7.parent = rank6;
                rank7.star = 60;
                rank7.salary = salary7;
                await transactionalEntityManager.save(rank7);

                const salary8 = new MoneyEntity();
                salary8.copper = 0;
                salary8.silver = 0;
                salary8.eclevtrum = 0;
                salary8.gold = 0;
                salary8.platinum = 1;
                await transactionalEntityManager.save(salary8);
                const rank8 = new ArmedForcesRankEntity();
                rank8.name = 'Золотой рыцарь Сердца 4-го уровня';
                rank8.description = '';
                rank8.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank8.parent = rank7;
                rank8.star = 55;
                rank8.salary = salary8;
                await transactionalEntityManager.save(rank8);

                const salary9 = new MoneyEntity();
                salary9.copper = 0;
                salary9.silver = 0;
                salary9.eclevtrum = 8;
                salary9.gold = 0;
                salary9.platinum = 0;
                await transactionalEntityManager.save(salary9);
                const rank9 = new ArmedForcesRankEntity();
                rank9.name = 'Серебряный рыцарь Сердца 1-го уровня';
                rank9.description = '';
                rank9.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank9.parent = rank8;
                rank9.star = 46;
                rank9.salary = salary9;
                await transactionalEntityManager.save(rank9);

                const salary10 = new MoneyEntity();
                salary10.copper = 0;
                salary10.silver = 0;
                salary10.eclevtrum = 6;
                salary10.gold = 0;
                salary10.platinum = 0;
                await transactionalEntityManager.save(salary10);
                const rank10 = new ArmedForcesRankEntity();
                rank10.name = 'Серебряный рыцарь Сердца 2-го уровня';
                rank10.description = '';
                rank10.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank10.parent = rank9;
                rank10.star = 39;
                rank10.salary = salary10;
                await transactionalEntityManager.save(rank10);

                const salary11 = new MoneyEntity();
                salary11.copper = 0;
                salary11.silver = 0;
                salary11.eclevtrum = 4;
                salary11.gold = 0;
                salary11.platinum = 0;
                await transactionalEntityManager.save(salary11);
                const rank11 = new ArmedForcesRankEntity();
                rank11.name = 'Серебряный рыцарь Сердца 3-го уровня';
                rank11.description = '';
                rank11.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank11.parent = rank10;
                rank11.star = 33;
                rank11.salary = salary11;
                await transactionalEntityManager.save(rank11);

                const salary12 = new MoneyEntity();
                salary12.copper = 0;
                salary12.silver = 0;
                salary12.eclevtrum = 2;
                salary12.gold = 0;
                salary12.platinum = 0;
                await transactionalEntityManager.save(salary12);
                const rank12 = new ArmedForcesRankEntity();
                rank12.name = 'Серебряный рыцарь Сердца 4-го уровня';
                rank12.description = '';
                rank12.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank12.parent = rank11;
                rank12.star = 28;
                rank12.salary = salary12;
                await transactionalEntityManager.save(rank12);

                const salary13 = new MoneyEntity();
                salary13.copper = 0;
                salary13.silver = 0;
                salary13.eclevtrum = 1;
                salary13.gold = 0;
                salary13.platinum = 0;
                await transactionalEntityManager.save(salary13);
                const rank13 = new ArmedForcesRankEntity();
                rank13.name = 'Бронзовый рыцарь Сердца 1-го уровня';
                rank13.description = '';
                rank13.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank13.parent = rank12;
                rank13.star = 24;
                rank13.salary = salary13;
                await transactionalEntityManager.save(rank13);

                const salary14 = new MoneyEntity();
                salary14.copper = 0;
                salary14.silver = 4;
                salary14.eclevtrum = 0;
                salary14.gold = 0;
                salary14.platinum = 0;
                await transactionalEntityManager.save(salary14);
                const rank14 = new ArmedForcesRankEntity();
                rank14.name = 'Бронзовый рыцарь Сердца 2-го уровня';
                rank14.description = '';
                rank14.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank14.parent = rank13;
                rank14.star = 18;
                rank14.salary = salary14;
                await transactionalEntityManager.save(rank14);

                const salary15 = new MoneyEntity();
                salary15.copper = 0;
                salary15.silver = 3;
                salary15.eclevtrum = 0;
                salary15.gold = 0;
                salary15.platinum = 0;
                await transactionalEntityManager.save(salary15);
                const rank15 = new ArmedForcesRankEntity();
                rank15.name = 'Бронзовый рыцарь Сердца 3-го уровня';
                rank15.description = '';
                rank15.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank15.parent = rank14;
                rank15.star = 14;
                rank15.salary = salary15;
                await transactionalEntityManager.save(rank15);

                const salary16 = new MoneyEntity();
                salary16.copper = 0;
                salary16.silver = 2;
                salary16.eclevtrum = 0;
                salary16.gold = 0;
                salary16.platinum = 0;
                await transactionalEntityManager.save(salary16);
                const rank16 = new ArmedForcesRankEntity();
                rank16.name = 'Бронзовый рыцарь Сердца 4-го уровня';
                rank16.description = '';
                rank16.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank16.parent = rank15;
                rank16.star = 8;
                rank16.salary = salary16;
                await transactionalEntityManager.save(rank16);

                const salary17 = new MoneyEntity();
                salary17.copper = 4;
                salary17.silver = 0;
                salary17.eclevtrum = 0;
                salary17.gold = 0;
                salary17.platinum = 0;
                await transactionalEntityManager.save(salary17);
                const rank17 = new ArmedForcesRankEntity();
                rank17.name = 'Ученик Сердца 1-го уровня';
                rank17.description = '';
                rank17.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank17.parent = rank16;
                rank17.star = 6;
                rank17.salary = salary17;
                await transactionalEntityManager.save(rank17);

                const salary18 = new MoneyEntity();
                salary18.copper = 3;
                salary18.silver = 0;
                salary18.eclevtrum = 0;
                salary18.gold = 0;
                salary18.platinum = 0;
                await transactionalEntityManager.save(salary18);
                const rank18 = new ArmedForcesRankEntity();
                rank18.name = 'Ученик Сердца 2-го уровня';
                rank18.description = '';
                rank18.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank18.parent = rank17;
                rank18.star = 4;
                rank18.salary = salary18;
                await transactionalEntityManager.save(rank18);

                const salary19 = new MoneyEntity();
                salary19.copper = 2;
                salary19.silver = 0;
                salary19.eclevtrum = 0;
                salary19.gold = 0;
                salary19.platinum = 0;
                await transactionalEntityManager.save(salary19);
                const rank19 = new ArmedForcesRankEntity();
                rank19.name = 'Ученик Сердца 3-го уровня';
                rank19.description = '';
                rank19.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank19.parent = rank18;
                rank19.star = 2;
                rank19.salary = salary19;
                await transactionalEntityManager.save(rank19);

                const salary20 = new MoneyEntity();
                salary20.copper = 1;
                salary20.silver = 0;
                salary20.eclevtrum = 0;
                salary20.gold = 0;
                salary20.platinum = 0;
                await transactionalEntityManager.save(salary20);

                const rank20 = new ArmedForcesRankEntity();
                rank20.name = 'Ученик Сердца 4-го уровня';
                rank20.description = '';
                rank20.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank20.parent = rank19;
                rank20.star = 0;
                rank20.salary = salary20;
                await transactionalEntityManager.save(rank20);
            }
        );
    }

    async insertDiamond() {
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const salary0 = new MoneyEntity();
                salary0.copper = 0;
                salary0.silver = 0;
                salary0.gold = 0;
                salary0.eclevtrum = 0;
                salary0.platinum = 6;
                await transactionalEntityManager.save(salary0);
                const rank0 = new ArmedForcesRankEntity();
                rank0.name = 'Алмазный полководец';
                rank0.description = '';
                rank0.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank0.parent = null;
                rank0.star = 140;
                rank0.salary = salary0;
                await transactionalEntityManager.save(rank0);

                const salary1 = new MoneyEntity();
                salary1.copper = 0;
                salary1.silver = 0;
                salary1.gold = 0;
                salary1.eclevtrum = 0;
                salary1.platinum = 6;
                await transactionalEntityManager.save(salary1);
                const rank1 = new ArmedForcesRankEntity();
                rank1.name = 'Сияющий генерал';
                rank1.description = '';
                rank1.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank1.parent = rank0;
                rank1.star = 110;
                rank1.salary = salary1;
                await transactionalEntityManager.save(rank1);

                const salary2 = new MoneyEntity();
                salary2.copper = 0;
                salary2.silver = 0;
                salary2.eclevtrum = 0;
                salary2.gold = 8;
                salary2.platinum = 3;
                await transactionalEntityManager.save(salary2);
                const rank2 = new ArmedForcesRankEntity();
                rank2.name = 'Генерал-полковник';
                rank2.description = '';
                rank2.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank2.parent = rank1;
                rank2.star = 104;
                rank2.salary = salary2;
                await transactionalEntityManager.save(rank2);

                const salary3 = new MoneyEntity();
                salary3.copper = 0;
                salary3.silver = 0;
                salary3.eclevtrum = 0;
                salary3.gold = 6;
                salary3.platinum = 3;
                await transactionalEntityManager.save(salary3);
                const rank3 = new ArmedForcesRankEntity();
                rank3.name = 'Генерал-лейтенант';
                rank3.description = '';
                rank3.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank3.parent = rank2;
                rank3.star = 96;
                rank3.salary = salary3;
                await transactionalEntityManager.save(rank3);

                const salary4 = new MoneyEntity();
                salary4.copper = 0;
                salary4.silver = 0;
                salary4.eclevtrum = 0;
                salary4.gold = 4;
                salary4.platinum = 3;
                await transactionalEntityManager.save(salary4);
                const rank4 = new ArmedForcesRankEntity();
                rank4.name = 'Генерал-майор';
                rank4.description = '';
                rank4.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank4.parent = rank3;
                rank4.star = 88;
                rank4.salary = salary4;
                await transactionalEntityManager.save(rank4);

                const salary5 = new MoneyEntity();
                salary5.copper = 0;
                salary5.silver = 0;
                salary5.eclevtrum = 0;
                salary5.gold = 2;
                salary5.platinum = 3;
                await transactionalEntityManager.save(salary5);
                const rank5 = new ArmedForcesRankEntity();
                rank5.name = 'Полковник';
                rank5.description = '';
                rank5.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank5.parent = rank4;
                rank5.star = 75;
                rank5.salary = salary5;
                await transactionalEntityManager.save(rank5);

                const salary6 = new MoneyEntity();
                salary6.copper = 0;
                salary6.silver = 0;
                salary6.eclevtrum = 0;
                salary6.gold = 0;
                salary6.platinum = 3;
                await transactionalEntityManager.save(salary6);
                const rank6 = new ArmedForcesRankEntity();
                rank6.name = 'Подполковник';
                rank6.description = '';
                rank6.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank6.parent = rank5;
                rank6.star = 65;
                rank6.salary = salary6;
                await transactionalEntityManager.save(rank6);

                const salary7 = new MoneyEntity();
                salary7.copper = 0;
                salary7.silver = 0;
                salary7.eclevtrum = 0;
                salary7.gold = 4;
                salary7.platinum = 1;
                await transactionalEntityManager.save(salary7);
                const rank7 = new ArmedForcesRankEntity();
                rank7.name = 'Майор';
                rank7.description = '';
                rank7.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank7.parent = rank6;
                rank7.star = 60;
                rank7.salary = salary7;
                await transactionalEntityManager.save(rank7);

                const salary8 = new MoneyEntity();
                salary8.copper = 0;
                salary8.silver = 0;
                salary8.eclevtrum = 0;
                salary8.gold = 0;
                salary8.platinum = 1;
                await transactionalEntityManager.save(salary8);
                const rank8 = new ArmedForcesRankEntity();
                rank8.name = 'Капитан';
                rank8.description = '';
                rank8.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank8.parent = rank7;
                rank8.star = 55;
                rank8.salary = salary8;
                await transactionalEntityManager.save(rank8);

                const salary9 = new MoneyEntity();
                salary9.copper = 0;
                salary9.silver = 0;
                salary9.eclevtrum = 8;
                salary9.gold = 0;
                salary9.platinum = 0;
                await transactionalEntityManager.save(salary9);
                const rank9 = new ArmedForcesRankEntity();
                rank9.name = 'Лейтенант';
                rank9.description = '';
                rank9.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank9.parent = rank8;
                rank9.star = 46;
                rank9.salary = salary9;
                await transactionalEntityManager.save(rank9);

                const salary10 = new MoneyEntity();
                salary10.copper = 0;
                salary10.silver = 0;
                salary10.eclevtrum = 6;
                salary10.gold = 0;
                salary10.platinum = 0;
                await transactionalEntityManager.save(salary10);
                const rank10 = new ArmedForcesRankEntity();
                rank10.name = 'Младший Лейтенант';
                rank10.description = '';
                rank10.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank10.parent = rank9;
                rank10.star = 39;
                rank10.salary = salary10;
                await transactionalEntityManager.save(rank10);

                const salary11 = new MoneyEntity();
                salary11.copper = 0;
                salary11.silver = 0;
                salary11.eclevtrum = 4;
                salary11.gold = 0;
                salary11.platinum = 0;
                await transactionalEntityManager.save(salary11);
                const rank11 = new ArmedForcesRankEntity();
                rank11.name = 'Офицер';
                rank11.description = '';
                rank11.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank11.parent = rank10;
                rank11.star = 33;
                rank11.salary = salary11;
                await transactionalEntityManager.save(rank11);

                const salary12 = new MoneyEntity();
                salary12.copper = 0;
                salary12.silver = 0;
                salary12.eclevtrum = 2;
                salary12.gold = 0;
                salary12.platinum = 0;
                await transactionalEntityManager.save(salary12);
                const rank12 = new ArmedForcesRankEntity();
                rank12.name = 'Сержант';
                rank12.description = '';
                rank12.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank12.parent = rank11;
                rank12.star = 28;
                rank12.salary = salary12;
                await transactionalEntityManager.save(rank12);

                const salary13 = new MoneyEntity();
                salary13.copper = 0;
                salary13.silver = 0;
                salary13.eclevtrum = 1;
                salary13.gold = 0;
                salary13.platinum = 0;
                await transactionalEntityManager.save(salary13);
                const rank13 = new ArmedForcesRankEntity();
                rank13.name = 'Младший сержант';
                rank13.description = '';
                rank13.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank13.parent = rank12;
                rank13.star = 24;
                rank13.salary = salary13;
                await transactionalEntityManager.save(rank13);

                const salary14 = new MoneyEntity();
                salary14.copper = 0;
                salary14.silver = 4;
                salary14.eclevtrum = 0;
                salary14.gold = 0;
                salary14.platinum = 0;
                await transactionalEntityManager.save(salary14);
                const rank14 = new ArmedForcesRankEntity();
                rank14.name = 'Главный капрал';
                rank14.description = '';
                rank14.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank14.parent = rank13;
                rank14.star = 18;
                rank14.salary = salary14;
                await transactionalEntityManager.save(rank14);

                const salary15 = new MoneyEntity();
                salary15.copper = 0;
                salary15.silver = 3;
                salary15.eclevtrum = 0;
                salary15.gold = 0;
                salary15.platinum = 0;
                await transactionalEntityManager.save(salary15);
                const rank15 = new ArmedForcesRankEntity();
                rank15.name = 'Капрал 1-го класса';
                rank15.description = '';
                rank15.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank15.parent = rank14;
                rank15.star = 14;
                rank15.salary = salary15;
                await transactionalEntityManager.save(rank15);

                const salary16 = new MoneyEntity();
                salary16.copper = 0;
                salary16.silver = 2;
                salary16.eclevtrum = 0;
                salary16.gold = 0;
                salary16.platinum = 0;
                await transactionalEntityManager.save(salary16);
                const rank16 = new ArmedForcesRankEntity();
                rank16.name = 'капрал 2-го класса';
                rank16.description = '';
                rank16.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank16.parent = rank15;
                rank16.star = 8;
                rank16.salary = salary16;
                await transactionalEntityManager.save(rank16);

                const salary17 = new MoneyEntity();
                salary17.copper = 4;
                salary17.silver = 0;
                salary17.eclevtrum = 0;
                salary17.gold = 0;
                salary17.platinum = 0;
                await transactionalEntityManager.save(salary17);
                const rank17 = new ArmedForcesRankEntity();
                rank17.name = 'Рядовой 1-го уровня';
                rank17.description = '';
                rank17.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank17.parent = rank16;
                rank17.star = 6;
                rank17.salary = salary17;
                await transactionalEntityManager.save(rank17);

                const salary18 = new MoneyEntity();
                salary18.copper = 3;
                salary18.silver = 0;
                salary18.eclevtrum = 0;
                salary18.gold = 0;
                salary18.platinum = 0;
                await transactionalEntityManager.save(salary18);
                const rank18 = new ArmedForcesRankEntity();
                rank18.name = 'Рядовой 2-го уровня';
                rank18.description = '';
                rank18.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank18.parent = rank17;
                rank18.star = 4;
                rank18.salary = salary18;
                await transactionalEntityManager.save(rank18);

                const salary19 = new MoneyEntity();
                salary19.copper = 2;
                salary19.silver = 0;
                salary19.eclevtrum = 0;
                salary19.gold = 0;
                salary19.platinum = 0;
                await transactionalEntityManager.save(salary19);
                const rank19 = new ArmedForcesRankEntity();
                rank19.name = 'Рядовой 3-го уровня';
                rank19.description = '';
                rank19.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank19.parent = rank18;
                rank19.star = 2;
                rank19.salary = salary19;
                await transactionalEntityManager.save(rank19);

                const salary20 = new MoneyEntity();
                salary20.copper = 1;
                salary20.silver = 0;
                salary20.eclevtrum = 0;
                salary20.gold = 0;
                salary20.platinum = 0;
                await transactionalEntityManager.save(salary20);

                const rank20 = new ArmedForcesRankEntity();
                rank20.name = 'Рекрут';
                rank20.description = '';
                rank20.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank20.parent = rank19;
                rank20.star = 0;
                rank20.salary = salary20;
                await transactionalEntityManager.save(rank20);
            }
        );
    }

    async insertSpide() {
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const salary0 = new MoneyEntity();
                salary0.copper = 0;
                salary0.silver = 0;
                salary0.gold = 0;
                salary0.eclevtrum = 0;
                salary0.platinum = 6;
                await transactionalEntityManager.save(salary0);
                const rank0 = new ArmedForcesRankEntity();
                rank0.name = 'Пиковый генерал';
                rank0.description = '';
                rank0.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank0.parent = null;
                rank0.star = 130;
                rank0.salary = salary0;
                await transactionalEntityManager.save(rank0);

                const salary1 = new MoneyEntity();
                salary1.copper = 0;
                salary1.silver = 0;
                salary1.gold = 0;
                salary1.eclevtrum = 0;
                salary1.platinum = 6;
                await transactionalEntityManager.save(salary1);
                const rank1 = new ArmedForcesRankEntity();
                rank1.name = 'Старший Лейтенант 1-го класса';
                rank1.description = '';
                rank1.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank1.parent = rank0;
                rank1.star = 110;
                rank1.salary = salary1;
                await transactionalEntityManager.save(rank1);

                const salary2 = new MoneyEntity();
                salary2.copper = 0;
                salary2.silver = 0;
                salary2.eclevtrum = 0;
                salary2.gold = 8;
                salary2.platinum = 3;
                await transactionalEntityManager.save(salary2);
                const rank2 = new ArmedForcesRankEntity();
                rank2.name = 'Старший Лейтенант 2-го класса';
                rank2.description = '';
                rank2.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank2.parent = rank1;
                rank2.star = 104;
                rank2.salary = salary2;
                await transactionalEntityManager.save(rank2);

                const salary3 = new MoneyEntity();
                salary3.copper = 0;
                salary3.silver = 0;
                salary3.eclevtrum = 0;
                salary3.gold = 6;
                salary3.platinum = 3;
                await transactionalEntityManager.save(salary3);
                const rank3 = new ArmedForcesRankEntity();
                rank3.name = 'Лейтенант 1-го класса';
                rank3.description = '';
                rank3.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank3.parent = rank2;
                rank3.star = 96;
                rank3.salary = salary3;
                await transactionalEntityManager.save(rank3);

                const salary4 = new MoneyEntity();
                salary4.copper = 0;
                salary4.silver = 0;
                salary4.eclevtrum = 0;
                salary4.gold = 4;
                salary4.platinum = 3;
                await transactionalEntityManager.save(salary4);
                const rank4 = new ArmedForcesRankEntity();
                rank4.name = 'Лейтенант 2-го класса';
                rank4.description = '';
                rank4.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank4.parent = rank3;
                rank4.star = 88;
                rank4.salary = salary4;
                await transactionalEntityManager.save(rank4);

                const salary5 = new MoneyEntity();
                salary5.copper = 0;
                salary5.silver = 0;
                salary5.eclevtrum = 0;
                salary5.gold = 2;
                salary5.platinum = 3;
                await transactionalEntityManager.save(salary5);
                const rank5 = new ArmedForcesRankEntity();
                rank5.name = 'Лейтенант 3-го класса';
                rank5.description = '';
                rank5.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank5.parent = rank4;
                rank5.star = 75;
                rank5.salary = salary5;
                await transactionalEntityManager.save(rank5);

                const salary6 = new MoneyEntity();
                salary6.copper = 0;
                salary6.silver = 0;
                salary6.eclevtrum = 0;
                salary6.gold = 0;
                salary6.platinum = 3;
                await transactionalEntityManager.save(salary6);
                const rank6 = new ArmedForcesRankEntity();
                rank6.name = 'Лейтенант 4-го класса';
                rank6.description = '';
                rank6.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank6.parent = rank5;
                rank6.star = 65;
                rank6.salary = salary6;
                await transactionalEntityManager.save(rank6);

                const salary7 = new MoneyEntity();
                salary7.copper = 0;
                salary7.silver = 0;
                salary7.eclevtrum = 0;
                salary7.gold = 4;
                salary7.platinum = 1;
                await transactionalEntityManager.save(salary7);
                const rank7 = new ArmedForcesRankEntity();
                rank7.name = 'Младший Лейтенант 1-го класса';
                rank7.description = '';
                rank7.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank7.parent = rank6;
                rank7.star = 60;
                rank7.salary = salary7;
                await transactionalEntityManager.save(rank7);

                const salary8 = new MoneyEntity();
                salary8.copper = 0;
                salary8.silver = 0;
                salary8.eclevtrum = 0;
                salary8.gold = 0;
                salary8.platinum = 1;
                await transactionalEntityManager.save(salary8);
                const rank8 = new ArmedForcesRankEntity();
                rank8.name = 'Младший Лейтенант 2-го класса';
                rank8.description = '';
                rank8.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank8.parent = rank7;
                rank8.star = 55;
                rank8.salary = salary8;
                await transactionalEntityManager.save(rank8);

                const salary9 = new MoneyEntity();
                salary9.copper = 0;
                salary9.silver = 0;
                salary9.eclevtrum = 8;
                salary9.gold = 0;
                salary9.platinum = 0;
                await transactionalEntityManager.save(salary9);
                const rank9 = new ArmedForcesRankEntity();
                rank9.name = 'Младший Лейтенант 3-го класса';
                rank9.description = '';
                rank9.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank9.parent = rank8;
                rank9.star = 46;
                rank9.salary = salary9;
                await transactionalEntityManager.save(rank9);

                const salary10 = new MoneyEntity();
                salary10.copper = 0;
                salary10.silver = 0;
                salary10.eclevtrum = 6;
                salary10.gold = 0;
                salary10.platinum = 0;
                await transactionalEntityManager.save(salary10);
                const rank10 = new ArmedForcesRankEntity();
                rank10.name = 'Младший Лейтенант 4-го класса';
                rank10.description = '';
                rank10.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank10.parent = rank9;
                rank10.star = 39;
                rank10.salary = salary10;
                await transactionalEntityManager.save(rank10);

                const salary11 = new MoneyEntity();
                salary11.copper = 0;
                salary11.silver = 0;
                salary11.eclevtrum = 4;
                salary11.gold = 0;
                salary11.platinum = 0;
                await transactionalEntityManager.save(salary11);
                const rank11 = new ArmedForcesRankEntity();
                rank11.name = 'Старший солдат 1-го класса';
                rank11.description = '';
                rank11.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank11.parent = rank10;
                rank11.star = 33;
                rank11.salary = salary11;
                await transactionalEntityManager.save(rank11);

                const salary12 = new MoneyEntity();
                salary12.copper = 0;
                salary12.silver = 0;
                salary12.eclevtrum = 2;
                salary12.gold = 0;
                salary12.platinum = 0;
                await transactionalEntityManager.save(salary12);
                const rank12 = new ArmedForcesRankEntity();
                rank12.name = 'Старший солдат 2-го класса';
                rank12.description = '';
                rank12.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank12.parent = rank11;
                rank12.star = 28;
                rank12.salary = salary12;
                await transactionalEntityManager.save(rank12);

                const salary13 = new MoneyEntity();
                salary13.copper = 0;
                salary13.silver = 0;
                salary13.eclevtrum = 1;
                salary13.gold = 0;
                salary13.platinum = 0;
                await transactionalEntityManager.save(salary13);
                const rank13 = new ArmedForcesRankEntity();
                rank13.name = 'Старший солдат 3-го класса';
                rank13.description = '';
                rank13.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank13.parent = rank12;
                rank13.star = 24;
                rank13.salary = salary13;
                await transactionalEntityManager.save(rank13);

                const salary14 = new MoneyEntity();
                salary14.copper = 0;
                salary14.silver = 4;
                salary14.eclevtrum = 0;
                salary14.gold = 0;
                salary14.platinum = 0;
                await transactionalEntityManager.save(salary14);
                const rank14 = new ArmedForcesRankEntity();
                rank14.name = 'Старший солдат 4-го класса';
                rank14.description = '';
                rank14.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank14.parent = rank13;
                rank14.star = 18;
                rank14.salary = salary14;
                await transactionalEntityManager.save(rank14);

                const salary15 = new MoneyEntity();
                salary15.copper = 0;
                salary15.silver = 3;
                salary15.eclevtrum = 0;
                salary15.gold = 0;
                salary15.platinum = 0;
                await transactionalEntityManager.save(salary15);
                const rank15 = new ArmedForcesRankEntity();
                rank15.name = 'Младший солдат 1-го класса';
                rank15.description = '';
                rank15.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank15.parent = rank14;
                rank15.star = 14;
                rank15.salary = salary15;
                await transactionalEntityManager.save(rank15);

                const salary16 = new MoneyEntity();
                salary16.copper = 0;
                salary16.silver = 2;
                salary16.eclevtrum = 0;
                salary16.gold = 0;
                salary16.platinum = 0;
                await transactionalEntityManager.save(salary16);
                const rank16 = new ArmedForcesRankEntity();
                rank16.name = 'Младший солдат 2-го класса';
                rank16.description = '';
                rank16.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank16.parent = rank15;
                rank16.star = 8;
                rank16.salary = salary16;
                await transactionalEntityManager.save(rank16);

                const salary17 = new MoneyEntity();
                salary17.copper = 4;
                salary17.silver = 0;
                salary17.eclevtrum = 0;
                salary17.gold = 0;
                salary17.platinum = 0;
                await transactionalEntityManager.save(salary17);
                const rank17 = new ArmedForcesRankEntity();
                rank17.name = 'Младший солдат 3-го класса';
                rank17.description = '';
                rank17.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank17.parent = rank16;
                rank17.star = 6;
                rank17.salary = salary17;
                await transactionalEntityManager.save(rank17);

                const salary18 = new MoneyEntity();
                salary18.copper = 3;
                salary18.silver = 0;
                salary18.eclevtrum = 0;
                salary18.gold = 0;
                salary18.platinum = 0;
                await transactionalEntityManager.save(salary18);
                const rank18 = new ArmedForcesRankEntity();
                rank18.name = 'Младший солдат 4-го класса';
                rank18.description = '';
                rank18.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank18.parent = rank17;
                rank18.star = 4;
                rank18.salary = salary18;
                await transactionalEntityManager.save(rank18);

                const salary19 = new MoneyEntity();
                salary19.copper = 2;
                salary19.silver = 0;
                salary19.eclevtrum = 0;
                salary19.gold = 0;
                salary19.platinum = 0;
                await transactionalEntityManager.save(salary19);
                const rank19 = new ArmedForcesRankEntity();
                rank19.name = 'Младший солдат 5-го класса';
                rank19.description = '';
                rank19.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank19.parent = rank18;
                rank19.star = 2;
                rank19.salary = salary19;
                await transactionalEntityManager.save(rank19);

                const salary20 = new MoneyEntity();
                salary20.copper = 1;
                salary20.silver = 0;
                salary20.eclevtrum = 0;
                salary20.gold = 0;
                salary20.platinum = 0;
                await transactionalEntityManager.save(salary20);

                const rank20 = new ArmedForcesRankEntity();
                rank20.name = 'Младший солдат 6-го класса';
                rank20.description = '';
                rank20.armorForcesId = '2a790955-b4b6-4ec7-8840-bcfab2ee19e0';
                rank20.parent = rank19;
                rank20.star = 0;
                rank20.salary = salary20;
                await transactionalEntityManager.save(rank20);
            }
        );
    }

    async insertClover() {
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                const salary0 = new MoneyEntity();
                salary0.copper = 0;
                salary0.silver = 0;
                salary0.gold = 0;
                salary0.eclevtrum = 0;
                salary0.platinum = 6;
                await transactionalEntityManager.save(salary0);
                const rank0 = new ArmedForcesRankEntity();
                rank0.name = 'Король магов';
                rank0.description = '';
                rank0.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank0.parent = null;
                rank0.star = 130;
                rank0.salary = salary0;
                await transactionalEntityManager.save(rank0);

                const salary1 = new MoneyEntity();
                salary1.copper = 0;
                salary1.silver = 0;
                salary1.gold = 0;
                salary1.eclevtrum = 0;
                salary1.platinum = 6;
                await transactionalEntityManager.save(salary1);
                const rank1 = new ArmedForcesRankEntity();
                rank1.name = 'Великий рыцарь-чародей 1-го ранга';
                rank1.description = '';
                rank1.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank1.parent = rank0;
                rank1.star = 110;
                rank1.salary = salary1;
                await transactionalEntityManager.save(rank1);

                const salary2 = new MoneyEntity();
                salary2.copper = 0;
                salary2.silver = 0;
                salary2.eclevtrum = 0;
                salary2.gold = 8;
                salary2.platinum = 3;
                await transactionalEntityManager.save(salary2);
                const rank2 = new ArmedForcesRankEntity();
                rank2.name = 'Великий рыцарь-чародей 2-го ранга';
                rank2.description = '';
                rank2.armorForcesId = 'aaae212a-0992-4462-918e-7a871551c87a';
                rank2.parent = rank1;
                rank2.star = 104;
                rank2.salary = salary2;
                await transactionalEntityManager.save(rank2);

                const salary3 = new MoneyEntity();
                salary3.copper = 0;
                salary3.silver = 0;
                salary3.eclevtrum = 0;
                salary3.gold = 6;
                salary3.platinum = 3;
                await transactionalEntityManager.save(salary3);
                const rank3 = new ArmedForcesRankEntity();
                rank3.name = 'Великий рыцарь-чародей 3-го ранга';
                rank3.description = '';
                rank3.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank3.parent = rank2;
                rank3.star = 96;
                rank3.salary = salary3;
                await transactionalEntityManager.save(rank3);

                const salary4 = new MoneyEntity();
                salary4.copper = 0;
                salary4.silver = 0;
                salary4.eclevtrum = 0;
                salary4.gold = 4;
                salary4.platinum = 3;
                await transactionalEntityManager.save(salary4);
                const rank4 = new ArmedForcesRankEntity();
                rank4.name = 'Великий рыцарь-чародей 4-го ранга';
                rank4.description = '';
                rank4.armorForcesId = '50c2fa68-5f53-4d48-ac52-f56afe74b8e6';
                rank4.parent = rank3;
                rank4.star = 88;
                rank4.salary = salary4;
                await transactionalEntityManager.save(rank4);

                const salary5 = new MoneyEntity();
                salary5.copper = 0;
                salary5.silver = 0;
                salary5.eclevtrum = 0;
                salary5.gold = 2;
                salary5.platinum = 3;
                await transactionalEntityManager.save(salary5);
                const rank5 = new ArmedForcesRankEntity();
                rank5.name = 'Великий рыцарь-чародей 5-го ранга';
                rank5.description = '';
                rank5.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank5.parent = rank4;
                rank5.star = 75;
                rank5.salary = salary5;
                await transactionalEntityManager.save(rank5);

                const salary6 = new MoneyEntity();
                salary6.copper = 0;
                salary6.silver = 0;
                salary6.eclevtrum = 0;
                salary6.gold = 0;
                salary6.platinum = 3;
                await transactionalEntityManager.save(salary6);
                const rank6 = new ArmedForcesRankEntity();
                rank6.name = 'Старший рыцарь-чародей 1-го ранга';
                rank6.description = '';
                rank6.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank6.parent = rank5;
                rank6.star = 65;
                rank6.salary = salary6;
                await transactionalEntityManager.save(rank6);

                const salary7 = new MoneyEntity();
                salary7.copper = 0;
                salary7.silver = 0;
                salary7.eclevtrum = 0;
                salary7.gold = 4;
                salary7.platinum = 1;
                await transactionalEntityManager.save(salary7);
                const rank7 = new ArmedForcesRankEntity();
                rank7.name = 'Старший рыцарь-чародей 2-го ранга';
                rank7.description = '';
                rank7.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank7.parent = rank6;
                rank7.star = 60;
                rank7.salary = salary7;
                await transactionalEntityManager.save(rank7);

                const salary8 = new MoneyEntity();
                salary8.copper = 0;
                salary8.silver = 0;
                salary8.eclevtrum = 0;
                salary8.gold = 0;
                salary8.platinum = 1;
                await transactionalEntityManager.save(salary8);
                const rank8 = new ArmedForcesRankEntity();
                rank8.name = 'Старший рыцарь-чародей 3-го ранга';
                rank8.description = '';
                rank8.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank8.parent = rank7;
                rank8.star = 55;
                rank8.salary = salary8;
                await transactionalEntityManager.save(rank8);

                const salary9 = new MoneyEntity();
                salary9.copper = 0;
                salary9.silver = 0;
                salary9.eclevtrum = 8;
                salary9.gold = 0;
                salary9.platinum = 0;
                await transactionalEntityManager.save(salary9);
                const rank9 = new ArmedForcesRankEntity();
                rank9.name = 'Старший рыцарь-чародей 4-го ранга';
                rank9.description = '';
                rank9.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank9.parent = rank8;
                rank9.star = 46;
                rank9.salary = salary9;
                await transactionalEntityManager.save(rank9);

                const salary10 = new MoneyEntity();
                salary10.copper = 0;
                salary10.silver = 0;
                salary10.eclevtrum = 6;
                salary10.gold = 0;
                salary10.platinum = 0;
                await transactionalEntityManager.save(salary10);
                const rank10 = new ArmedForcesRankEntity();
                rank10.name = 'Старший рыцарь-чародей 5-го ранга';
                rank10.description = '';
                rank10.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank10.parent = rank9;
                rank10.star = 39;
                rank10.salary = salary10;
                await transactionalEntityManager.save(rank10);

                const salary11 = new MoneyEntity();
                salary11.copper = 0;
                salary11.silver = 0;
                salary11.eclevtrum = 4;
                salary11.gold = 0;
                salary11.platinum = 0;
                await transactionalEntityManager.save(salary11);
                const rank11 = new ArmedForcesRankEntity();
                rank11.name = 'Средний рыцарь-чародей 1-го ранга';
                rank11.description = '';
                rank11.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank11.parent = rank10;
                rank11.star = 33;
                rank11.salary = salary11;
                await transactionalEntityManager.save(rank11);

                const salary12 = new MoneyEntity();
                salary12.copper = 0;
                salary12.silver = 0;
                salary12.eclevtrum = 2;
                salary12.gold = 0;
                salary12.platinum = 0;
                await transactionalEntityManager.save(salary12);
                const rank12 = new ArmedForcesRankEntity();
                rank12.name = 'Средний рыцарь-чародей 2-го ранга';
                rank12.description = '';
                rank12.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank12.parent = rank11;
                rank12.star = 28;
                rank12.salary = salary12;
                await transactionalEntityManager.save(rank12);

                const salary13 = new MoneyEntity();
                salary13.copper = 0;
                salary13.silver = 0;
                salary13.eclevtrum = 1;
                salary13.gold = 0;
                salary13.platinum = 0;
                await transactionalEntityManager.save(salary13);
                const rank13 = new ArmedForcesRankEntity();
                rank13.name = 'Средний рыцарь-чародей 3-го ранга';
                rank13.description = '';
                rank13.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank13.parent = rank12;
                rank13.star = 24;
                rank13.salary = salary13;
                await transactionalEntityManager.save(rank13);

                const salary14 = new MoneyEntity();
                salary14.copper = 0;
                salary14.silver = 4;
                salary14.eclevtrum = 0;
                salary14.gold = 0;
                salary14.platinum = 0;
                await transactionalEntityManager.save(salary14);
                const rank14 = new ArmedForcesRankEntity();
                rank14.name = 'Средний рыцарь-чародей 4-го ранга';
                rank14.description = '';
                rank14.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank14.parent = rank13;
                rank14.star = 18;
                rank14.salary = salary14;
                await transactionalEntityManager.save(rank14);

                const salary15 = new MoneyEntity();
                salary15.copper = 0;
                salary15.silver = 3;
                salary15.eclevtrum = 0;
                salary15.gold = 0;
                salary15.platinum = 0;
                await transactionalEntityManager.save(salary15);
                const rank15 = new ArmedForcesRankEntity();
                rank15.name = 'Средний рыцарь-чародей 5-го ранга';
                rank15.description = '';
                rank15.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank15.parent = rank14;
                rank15.star = 14;
                rank15.salary = salary15;
                await transactionalEntityManager.save(rank15);

                const salary16 = new MoneyEntity();
                salary16.copper = 0;
                salary16.silver = 2;
                salary16.eclevtrum = 0;
                salary16.gold = 0;
                salary16.platinum = 0;
                await transactionalEntityManager.save(salary16);
                const rank16 = new ArmedForcesRankEntity();
                rank16.name = 'Младший рыцарь-чародей 1-го ранга';
                rank16.description = '';
                rank16.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank16.parent = rank15;
                rank16.star = 8;
                rank16.salary = salary16;
                await transactionalEntityManager.save(rank16);

                const salary17 = new MoneyEntity();
                salary17.copper = 4;
                salary17.silver = 0;
                salary17.eclevtrum = 0;
                salary17.gold = 0;
                salary17.platinum = 0;
                await transactionalEntityManager.save(salary17);
                const rank17 = new ArmedForcesRankEntity();
                rank17.name = 'Младший рыцарь-чародей 2-го ранга';
                rank17.description = '';
                rank17.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank17.parent = rank16;
                rank17.star = 6;
                rank17.salary = salary17;
                await transactionalEntityManager.save(rank17);

                const salary18 = new MoneyEntity();
                salary18.copper = 3;
                salary18.silver = 0;
                salary18.eclevtrum = 0;
                salary18.gold = 0;
                salary18.platinum = 0;
                await transactionalEntityManager.save(salary18);
                const rank18 = new ArmedForcesRankEntity();
                rank18.name = 'Младший рыцарь-чародей 3-го ранга';
                rank18.description = '';
                rank18.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank18.parent = rank17;
                rank18.star = 4;
                rank18.salary = salary18;
                await transactionalEntityManager.save(rank18);

                const salary19 = new MoneyEntity();
                salary19.copper = 2;
                salary19.silver = 0;
                salary19.eclevtrum = 0;
                salary19.gold = 0;
                salary19.platinum = 0;
                await transactionalEntityManager.save(salary19);
                const rank19 = new ArmedForcesRankEntity();
                rank19.name = 'Младший рыцарь-чародей 4-го ранга';
                rank19.description = '';
                rank19.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank19.parent = rank18;
                rank19.star = 2;
                rank19.salary = salary19;
                await transactionalEntityManager.save(rank19);

                const salary20 = new MoneyEntity();
                salary20.copper = 1;
                salary20.silver = 0;
                salary20.eclevtrum = 0;
                salary20.gold = 0;
                salary20.platinum = 0;
                await transactionalEntityManager.save(salary20);

                const rank20 = new ArmedForcesRankEntity();
                rank20.name = 'Младший рыцарь-чародей 5-го ранга';
                rank20.description = '';
                rank20.armorForcesId = '76ba223d-433c-465c-91f6-a5513aa79ac2';
                rank20.parent = rank19;
                rank20.star = 0;
                rank20.salary = salary20;
                await transactionalEntityManager.save(rank20);
            }
        );
    }
}
