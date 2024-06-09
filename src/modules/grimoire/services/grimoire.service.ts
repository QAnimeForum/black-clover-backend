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
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ENUM_SPELL_STATUS } from '../constants/spell.status.enum.constant';
import { SpellRequirementsEntity } from '../entity/spell.requirements.entity';
import { SpellUpdateTypeDto } from '../dto/spell.update-type.dto';
import { SpellCastEditDto } from '../dto/spell.update-cast-time.dto';
import { where } from 'sequelize';
import { SpellUpdateGoalsDto } from '../dto/spell.update-goals.dto';
@Injectable()
export class GrimoireService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(SpellEntity)
        private readonly spellRepository: Repository<SpellEntity>,
        @InjectRepository(SpellRequirementsEntity)
        private readonly spellRequirementsRepository: Repository<SpellRequirementsEntity>
    ) {}

    public findAllGrimoires(
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
            ],
            filterableColumns: {
                magicName: true,
            },
        });
    }

    async findGrimoireById(id: string): Promise<GrimoireEntity> {
        const entity = await this.grimoireRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                spells: true,
            },
        });
        return entity;
    }

    async findGrimoireByUserTgId(tgUserId: string): Promise<GrimoireEntity> {
        const grimoire = await this.grimoireRepository
            .createQueryBuilder('grimoire')
            .innerJoinAndSelect(
                'grimoire.character',
                'charcter',
                'character.tgUserId = :tgUserId',
                { tgUserId: tgUserId }
            )
            .leftJoinAndSelect('grimoire.spells', 'spell')
            .getOne();
        return grimoire;

        /**
        *  
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tgUserId,
            },
            relations: {
                character: {
                    grimoire: true,
                },
            },
        });
        return entity.character.grimoire;*/
    }

    async createGrimoire(dto: GrimoireCreateDto): Promise<GrimoireEntity> {
        return await this.grimoireRepository.save({
            magicName: dto?.magicName ?? 'не выбрана',
            coverSymbol: dto.coverSymbol,
            coverImagePath: 'default-grimoire.jpg',
        });
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
        const grimoire = await this.findGrimoireById(grimoireId);
        return this.spellRepository.find({
            where: {
                grimoire: grimoire,
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
            relations: {
                requirements: true,
            }
        });
        return entity;
    }

    async createSpell(dto: SpellCreateDto) {
        let spellEntity: SpellEntity;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                // execute queries using transactionalEntityManager
                const requirementsEntity = new SpellRequirementsEntity();
                requirementsEntity.minimalLevel = dto.minLevel;
                requirementsEntity.magicalAttributes = [];
                const requirementsEntityId = (
                    await transactionalEntityManager.save(requirementsEntity)
                ).id;

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
                const grimoire = await this.findGrimoireById(dto.grimoireId);
                spellEntity.grimoire = grimoire;
                spellEntity.grimoireId = dto.grimoireId;
                spellEntity.requirements = requirementsEntity;
                spellEntity.requirementsId = requirementsEntityId;
                await transactionalEntityManager.save(spellEntity);
            }
        );
    }

    async updateGrimoreMagicName(id: string, dto: GrimoireUpdateNameDto) {
        const grimoire = await this.findGrimoireById(id);
        grimoire.magicName = dto.magicName;
        return await this.grimoireRepository.save(grimoire);
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

    async updateMinimalLevel(id: string, dto: SpellUpdateMinimalLevel) {
        const spell = await this.findSpellById(id);
        this.spellRequirementsRepository.findBy({
            id: spell.requirementsId,
        });
        spell.requirements.minimalLevel = dto.minimalLevel;
        return await this.spellRequirementsRepository.save(spell.requirements);
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