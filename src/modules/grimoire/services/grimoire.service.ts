import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpellEntity } from '../entity/spell.entity';
import { GrimoireEntity } from '../entity/grimoire.entity';
import { GrimoireUpdateNameDto } from '../dto/grimoire.update-name.dto';
import { GrimoireUpdateColorDto } from '../dto/grimoire.update-color.dto';
import { GrimoireCreateDto } from '../dto/grimoire.create.dto';
import { SpellCreateDto } from '../dto/spell.create.dto';
import { SpellUpdateNameDto } from '../dto/spell.update-name.dto';
import { SpellUpdateDescriptionDto } from '../dto/spell.update-description.dto';
import { SpellUpdateDurationDto } from '../dto/spell.update-duration.dto';
import { SpellCastTimeDescriptionDto } from '../dto/spell.update-cast-time.dto';
import { SpellUpdateRangeDto } from '../dto/spell.update-range.dto';
import { SpellUpdateCostDto } from '../dto/spell.update-cost.dto';
import { SpellUpdateDto } from '../dto/spell.update.dto';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { UserEntity } from '../../user/entities/user.entity';
@Injectable()
export class GrimoireService {
    constructor(
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(SpellEntity)
        private readonly spellRepository: Repository<SpellEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findAllGrimoires(
        dto: PaginationListDto
    ): Promise<[SpellEntity[], number]> {
        const [entities, total] = await this.spellRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
        });
        return [entities, total];
    }

    async findGrimoireByUserId(tg_id: string): Promise<GrimoireEntity> {
        const entity = await this.userRepository.findOne({
            where: {
                tgUserId: tg_id,
            },
            relations: {
                character: {
                    grimoire: true,
                },
            },
        });
        return entity.character.grimoire;
    }

    async findGrimoireById(id: string): Promise<GrimoireEntity> {
        const entity = await this.grimoireRepository.findOneBy({
            id: id,
        });
        return entity;
    }

    async createEmptyGrimoire() {
        const insert = await this.grimoireRepository.insert({
            magicName: 'не выбрана',
            //   coverSymbol: coverSymbol,
            magicColor: 'не выбран',
        });
        return insert.raw[0].id;
    }

    async createGrimoire(dto: GrimoireCreateDto) {
        const insert = await this.grimoireRepository.insert({
            magicName: dto.magicName,
            //  coverSymbol: CardSymbolsEnum[dto.coverSymbol],
            magicColor: dto.magicColor,
        });
        return insert.raw[0].id;
    }

    async deleteGrimoire(id: string): Promise<void> {
        await this.grimoireRepository.delete(id);
    }
    async findSpellById(id: string): Promise<SpellEntity> {
        const entity = await this.spellRepository.findOneBy({
            id: id,
        });
        return entity;
    }

    async createSpell(dto: SpellCreateDto, grimoire: GrimoireEntity) {
        const insert = await this.spellRepository.insert({
            name: dto.name,
            description: dto.description,
            range: dto.range,
            duration: dto.duration,
            cost: dto.cost,
            castTime: dto.castTime,
            grimoire: grimoire,
        });
        return insert.raw[0].id;
    }

    async updateGrimoreMagicName(id: string, dto: GrimoireUpdateNameDto) {
        const grimoire = await this.findGrimoireById(id);
        grimoire.magicName = dto.magicName;
        await this.grimoireRepository.save(grimoire);
    }
    async updateGrimoreMagicColor(id: string, dto: GrimoireUpdateColorDto) {
        const grimoire = await this.findGrimoireById(id);
        grimoire.magicColor = dto.magicColor;
        await this.grimoireRepository.save(grimoire);
    }

    async updateSpellName(id: string, dto: SpellUpdateNameDto) {
        const spell = await this.findSpellById(id);
        spell.name = dto.name;
        await this.grimoireRepository.save(spell);
    }

    async updateSpellDescription(id: string, dto: SpellUpdateDescriptionDto) {
        const spell = await this.findSpellById(id);
        spell.description = dto.description;
        await this.grimoireRepository.save(spell);
    }

    async updateSpellDuration(id: string, dto: SpellUpdateDurationDto) {
        const spell = await this.findSpellById(id);
        spell.duration = dto.duration;
        await this.grimoireRepository.save(spell);
    }

    async updateSpellCost(id: string, dto: SpellUpdateCostDto) {
        const spell = await this.findSpellById(id);
        spell.cost = dto.cost;
        await this.grimoireRepository.save(spell);
    }
    async updateSpellRange(id: string, dto: SpellUpdateRangeDto) {
        const spell = await this.findSpellById(id);
        spell.range = dto.range;
        await this.grimoireRepository.save(spell);
    }

    async updateSpellCastTime(id: string, dto: SpellCastTimeDescriptionDto) {
        const spell = await this.findSpellById(id);
        spell.castTime = dto.castTime;
        await this.grimoireRepository.save(spell);
    }

    async updateSpell(id: string, dto: SpellUpdateDto) {
        const spell = await this.findSpellById(id);
        spell.name = dto.name;
        spell.description = dto.description;
        spell.duration = dto.duration;
        spell.cost = dto.cost;
        spell.range = dto.range;
        spell.castTime = dto.castTime;
        await this.grimoireRepository.save(spell);
    }

    async deleteSpell(id: string): Promise<void> {
        await this.spellRepository.delete(id);
    }

    async findSpells(grimoireId: string) {
        const grimoire = await this.findGrimoireById(grimoireId);
        return this.spellRepository.find({
            where: {
                grimoire: grimoire,
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

    async findAllSpells(
        dto: PaginationListDto,
        grimoireId: string
    ): Promise<[SpellEntity[], number]> {
        const grimoire = await this.findGrimoireById(grimoireId);
        const [entities, total] = await this.spellRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
            where: {
                grimoire: grimoire,
            },
        });
        return [entities, total];
    }

    async getAllSpells(grimoireId: string): Promise<[SpellEntity[], number]> {
        const grimoire = await this.findGrimoireById(grimoireId);
        const [entities, total] = await this.spellRepository.findAndCount({
            where: {
                grimoire: grimoire,
            },
        });
        return [entities, total];
    }
}
