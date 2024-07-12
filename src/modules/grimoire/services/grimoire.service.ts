import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SpellEntity } from '../entity/spell.entity';
import { GrimoireEntity } from '../entity/grimoire.entity';
import { GrimoireUpdateNameDto } from '../dto/grimoire.update-name.dto';
import { GrimoireCreateDto } from '../dto/grimoire.create.dto';
import { SpellCreateDto } from '../dto/spell.create.dto';
import { SpellUpdateNameDto } from '../dto/spell.update-name.dto';
import { SpellUpdateDescriptionDto } from '../dto/spell.update-description.dto';
import { SpellUpdateDurationDto } from '../dto/spell.update-duration.dto';
import { SpellUpdateRangeDto } from '../dto/spell.update-range.dto';
import { SpellUpdateCostDto } from '../dto/spell.update-cost.dto';
import {
    FilterOperator,
    FilterSuffix,
    paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { ENUM_SPELL_STATUS } from '../constants/spell.status.enum.constant';
import { SpellRequirementsEntity } from '../entity/spell.requirements.entity';
import { SpellUpdateTypeDto } from '../dto/spell.update-type.dto';
import { SpellCastEditDto } from '../dto/spell.update-cast-time.dto';

import { SpellUpdateGoalsDto } from '../dto/spell.update-goals.dto';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { GrimoireRequestEntity } from '../entity/grimoire.request.entity';
import { GrimoireReservationEntity } from '../entity/grimoire.reservation.entity';

@Injectable()
export class GrimoireService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>,
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(GrimoireRequestEntity)
        private readonly grimoireRequestRepository: Repository<GrimoireRequestEntity>,
        @InjectRepository(SpellEntity)
        private readonly spellRepository: Repository<SpellEntity>,
        @InjectRepository(SpellRequirementsEntity)
        private readonly spellRequirementsRepository: Repository<SpellRequirementsEntity>,
        @InjectRepository(GrimoireReservationEntity)
        private readonly grimoireReservationRepository: Repository<GrimoireReservationEntity>
    ) {}

    public countGrimoires() {
        return this.grimoireRepository.count();
    }

    public findAllGrimoires(
        query: PaginateQuery
    ): Promise<Paginated<CharacterEntity>> {
        return paginate(query, this.characterRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['grimoire.createdAt', 'ASC']],
            searchableColumns: ['id'],
            select: [
                'id',
                'user',
                'user.tgUserId',
                'background',
                'background.name',
                'characterCharacteristics',
                'characterCharacteristics.currentLevel',
                'grimoire',
                'grimoire.id',
                'grimoire.coverSymbol',
                'grimoire.magicName',
                'grimoire.coverImagePath',
                'grimoire.status',
                'grimoire.createdAt',
            ],
            relations: {
                characterCharacteristics: true,
                grimoire: true,
                background: true,
                user: true,
            },
            filterableColumns: {
                grimoire: [
                    FilterOperator.EQ,
                    FilterSuffix.NOT,
                    FilterOperator.NULL,
                ],
                'grimoire.id': [
                    FilterOperator.EQ,
                    FilterSuffix.NOT,
                    FilterOperator.NULL,
                ],
                'grimoire.status': [FilterOperator.EQ, FilterSuffix.NOT],
            },
        });
    }
   /**
    * 
    * @param query  public findAllGrimoires(
        query: PaginateQuery
    ): Promise<Paginated<GrimoireEntity>> {
        return paginate(query, this.grimoireRepository, {
            sortableColumns: ['id', 'coverSymbol', 'magicName', 'status'],
            nullSort: 'last',
            defaultSortBy: [['magicName', 'DESC']],
            searchableColumns: ['coverSymbol', 'magicName', 'status'],
            select: [
                'id',
                'coverSymbol',
                'magicName',
                'coverImagePath',
                'status',
                'character',
                'character.background',
                'character.background.name',
            ],
            filterableColumns: {
                magicName: true,
            },
            relations: ['character', 'character.background'],
        });
    }
    * @returns 
    */

    async findGrimoiresWithoutReservation(query: PaginateQuery) {
        /*   const sqlQuery = 'select * from equpment_item LEFT_JOIN shop ON equipment_item.id = shop.item_id where shop.id is null';*/
        const queryBuilder = this.grimoireRepository
            .createQueryBuilder()
            .select('grimoire')
            .from(GrimoireEntity, 'grimoire')
            .leftJoinAndMapMany(
                'grimoire.id',
                GrimoireReservationEntity,
                'grimoire_reservation',
                'grimoire_reservation.grimoire_id = grimoire.id'
            )
            .where('grimoire_reservation.grimoire_id is NULL');
        return paginate(query, queryBuilder, {
            sortableColumns: ['id', 'magicName'],
            nullSort: 'last',
            defaultSortBy: [['createdAt', 'ASC']],
            searchableColumns: ['magicName'],
            select: ['id', 'magicName', 'createdAt'],
            filterableColumns: {},
        });
    }

    async findGrimoireById(id: string): Promise<CharacterEntity> {
        /**
         *      const queryBuilder = this.characterRepository
            .createQueryBuilder()
            .select('character')
            .from(CharacterEntity, 'character')
            .leftJoinAndMapOne(
                'character.id',
                GrimoireEntity,
                'grimoire',
                'grimpoire.id = character.grimoire_id'
            )
            .where('grimoire.id = :id', { id: id })
            .innerJoinAndSelect(
                'spell.grimoire_id',
                'spell',
                'spell.id = :characterId',
                { characterId: characterId }
            );
         */
        /**
        *  const entity = await this.grimoireRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                spells: true,
            },
        });
        return entity;
        */
        return this.characterRepository.findOne({
            where: {
                grimoireId: id,
            },
            relations: {
                user: true,
                background: true,
                characterCharacteristics: true,
                grimoire: {
                    spells: true,
                },
            },
        });
    }
    async hasGrimoire(tgUserId: number) {
        const grimoires = await this.connection.query(
            `select grimoire.id from grimoire JOIN character ON grimoire.id = character.grimoire_id JOIN game_user on character.user_id = game_user.id  where game_user.tg_user_id = '${tgUserId}'`
        );
        return !(grimoires.length == 0);
    }
    async findGrimoireByUserTgId(tgUserId: number) {
        const character = await this.characterRepository.findOne({
            where: {
                user: {
                    tgUserId: tgUserId.toString(),
                },
            },
            relations: {
                grimoire: {
                    spells: true,
                },
            },
        });
        if (character.grimoire) {
            return character.grimoire;
        } else {
            return null;
        }
        /* const query = `select grimoire.*, spell.id, spell.name, spell.status from grimoire JOIN character ON grimoire.id = character.grimoire_id JOIN game_user on character.user_id = game_user.id JOIN  spell ON grimoire.id = spell.grimoire_id where game_user.tg_user_id = '${tgUserId}'`;
        const grimoires = await this.connection.query(query);
           const grimoires = await this.connection.query(
            `select grimoire.* from grimoire JOIN character ON grimoire.id = character.grimoire_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = '${tgUserId}'`
        )
        if (grimoires.length == 1) {
            return grimoires[0];
        }
        return null;*/
    }

    async findCharacterWithGrimoireByUserTgId(tgUserId: number) {
        const character = await this.characterRepository.findOne({
            where: {
                user: {
                    tgUserId: tgUserId.toString(),
                },
            },
            relations: {
                user: true,
                background: true,
                grimoire: {
                    spells: true,
                },
            },
        });
        return character;
    }

    async createGrimoire(dto: GrimoireCreateDto): Promise<GrimoireEntity> {
        return await this.grimoireRepository.save({
            magicName: dto?.magicName ?? 'не выбрана',
            coverSymbol: dto.coverSymbol,
            coverImagePath: 'default-grimoire.jpg',
        });
    }

    async isRequestExist(tgUserId: string) {
        console.log(tgUserId);
        return this.grimoireRequestRepository.exists({
            where: {
                tgUserId: tgUserId,
            },
        });
    }
    async createGrimoireRequest(
        tgUserId: string,
        tgUserName: string,
        magicName: string
    ) {
        const isRequestExist = await this.isRequestExist(tgUserId);
        if (isRequestExist) {
            throw Error('Запрос уже есть.');
        }
        const request = new GrimoireRequestEntity();
        request.tgUserId = tgUserId;
        request.tgUsername = tgUserName;
        request.magicName = magicName;
        return this.grimoireRequestRepository.insert(request);
    }

    deleteGrimoireRequest(grimoireRequestId: string) {
        return this.grimoireRequestRepository.delete(grimoireRequestId);
    }
    public findAllGrimoireRequests(
        query: PaginateQuery
    ): Promise<Paginated<GrimoireRequestEntity>> {
        return paginate(query, this.grimoireRequestRepository, {
            sortableColumns: ['id'],
            nullSort: 'last',
            defaultSortBy: [['tgUserId', 'DESC']],
            searchableColumns: ['tgUserId', 'tgUsername', 'magicName'],
            select: ['id', 'tgUserId', 'tgUsername', 'magicName'],
        });
    }

    public findGrimoireRequest(id: string) {
        return this.grimoireRequestRepository.findOneBy({ id: id });
    }
    async deleteGrimoire(id: string): Promise<void> {
        await this.grimoireRepository.delete(id);
    }

    async findGrimoireSpells(grimoireId: string) {
        return this.spellRepository.find({
            where: {
                grimoireId: grimoireId,
            },
        });
    }

    async findSpellNames(grimoireId: string) {
        const character = await this.findGrimoireById(grimoireId);
        return this.spellRepository.find({
            where: {
                grimoire: character.grimoire,
            },
            select: {
                name: true,
            },
        });
    }

    public findAllSpells(
        query: PaginateQuery
    ): Promise<Paginated<SpellEntity>> {
        /**
         *   where: {
                grimoire: grimoireId,
            },
         */
        return paginate(query, this.spellRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name', 'description', 'grimoireId'],
            filterableColumns: {
                name: true,
            },
        });
    }

    async findSpellById(id: string): Promise<SpellEntity> {
        const entity = await this.spellRepository.findOne({
            where: {
                id: id,
            },
        });
        return entity;
    }

    async createSpell(dto: SpellCreateDto) {
        let spellEntity: SpellEntity;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                // execute queries using transactionalEntityManager
                spellEntity = new SpellEntity();
                spellEntity.name = dto.name;
                spellEntity.description = dto.description;
                spellEntity.damage = dto.damage;
                spellEntity.range = dto.range;
                spellEntity.duration = dto.duration;
                spellEntity.cost = dto.cost;
                spellEntity.castTime = dto.castTime;
                spellEntity.cooldown = dto.cooldown;
                spellEntity.type = dto.type;
                spellEntity.goals = dto.goals;
                spellEntity.status = ENUM_SPELL_STATUS.DRAFT;
                // spellEntity.minimalCharacterLevel = dto.minLevel;
                //  spellEntity.requirements = dto.requipments;
                const character = await this.findGrimoireById(dto.grimoireId);
                spellEntity.grimoire = character.grimoire;
                spellEntity.grimoireId = dto.grimoireId;
                await transactionalEntityManager.save(spellEntity);
            }
        );
    }

    async updateGrimoreMagicName(id: string, dto: GrimoireUpdateNameDto) {
        const character = await this.findGrimoireById(id);
        character.grimoire.magicName = dto.magicName;
        return await this.grimoireRepository.save(character.grimoire);
    }
    async updateSpellName(id: string, dto: SpellUpdateNameDto) {
        const spell = await this.findSpellById(id);
        spell.name = dto.name;
        return await this.spellRepository.save(spell);
    }

    async updateCooldown(id: string, dto: SpellUpdateCooldownDto) {
        const spell = await this.findSpellById(id);
        spell.cooldown = dto.cooldown;
        return await this.spellRepository.save(spell);
    }

    async updateSpellDescription(id: string, dto: SpellUpdateDescriptionDto) {
        const spell = await this.findSpellById(id);
        spell.description = dto.description;
        return await this.spellRepository.save(spell);
    }

    async updateSpellDuration(id: string, dto: SpellUpdateDurationDto) {
        const spell = await this.findSpellById(id);
        spell.duration = dto.duration;
        return await this.spellRepository.save(spell);
    }

    async updageSpellDamage(id: string, damage: string) {
        const spell = await this.findSpellById(id);
        spell.damage = damage;
        return await this.spellRepository.save(spell);
    }
    async updateSpellCost(id: string, dto: SpellUpdateCostDto) {
        const spell = await this.findSpellById(id);
        spell.cost = dto.cost;
        return await this.spellRepository.save(spell);
    }
    async updateSpellRange(id: string, dto: SpellUpdateRangeDto) {
        const spell = await this.findSpellById(id);
        spell.range = dto.range;
        return await this.spellRepository.save(spell);
    }

    async updateSpellType(id: string, dto: SpellUpdateTypeDto) {
        const spell = await this.findSpellById(id);
        spell.type = dto.type;
        return await this.spellRepository.save(spell);
    }
    async updateSpellCastTime(id: string, dto: SpellCastEditDto) {
        const spell = await this.findSpellById(id);
        spell.castTime = dto.castTime;
        return await this.spellRepository.save(spell);
    }

    async updateSpellGoals(id: string, dto: SpellUpdateGoalsDto) {
        const spell = await this.findSpellById(id);
        spell.goals = dto.goals;
        return await this.spellRepository.save(spell);
    }

    /*  async updateMinimalLevel(id: string, dto: SpellUpdateMinimalLevel) {
        const spell = await this.findSpellById(id);
        spell.minimalCharacterLevel = dto.minimalLevel;
        return await this.spellRepository.save(spell);
    }*/

    async updateSpellStatus(id: string, dto: SpellUpdateStatusDto) {
        const spell = await this.findSpellById(id);
        spell.status = dto.status;
        return await this.spellRepository.save(spell);
    }
    async deleteSpell(id: string) {
        return await this.spellRepository.delete(id);
    }
}

export class SpellUpdateMinimalLevel {
    minimalLevel: number;
}

export class SpellUpdateCooldownDto {
    cooldown: string;
}

export class SpellUpdateStatusDto {
    status: ENUM_SPELL_STATUS;
}
