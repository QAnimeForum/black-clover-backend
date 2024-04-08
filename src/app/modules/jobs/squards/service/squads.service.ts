import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SquadEntity } from '../entity/squad.entity';
import { ArmedForcesEntity } from '../entity/armed.forces.entity';
import { SquadMemberEntity } from '../entity/squad.member.entity';
import { SquadRankEntity } from '../entity/squad.rank.entity';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { SquadCreateDto } from '../dto/squad.create.dto';
import { ArmedForcesCreateDto } from '../dto/armed.forces.create.dto';
import { SquadRankCreateDto } from '../dto/squad.rank.create.dto';
import { SalaryEntity } from 'src/app/modules/money/entity/amount.entity';
import { SquadMemberCreateDto } from '../dto/squad.member.create.dto';
import { CharacterEntity } from 'src/app/modules/character/entity/character.entity';
@Injectable()
export class SquadsService {
    constructor(
        @InjectRepository(SquadEntity)
        private readonly squadRepository: Repository<SquadEntity>,
        @InjectRepository(ArmedForcesEntity)
        private readonly armedForcesRepository: Repository<ArmedForcesEntity>,
        @InjectRepository(SquadRankEntity)
        private readonly rankRepository: Repository<SquadRankEntity>,
        @InjectRepository(SquadMemberEntity)
        private readonly squadMemberRepository: Repository<SquadMemberEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>
    ) {}

    async getAllSquads(
        dto: PaginationListDto
    ): Promise<[SquadEntity[], number]> {
        const [entities, total] = await this.squadRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
    }
    findSquadById(id: string): Promise<SquadEntity | null> {
        return this.squadRepository.findOneBy({ id });
    }
    async createSquad(dto: SquadCreateDto) {
        const forces = await this.findArmedForcesById(dto.forces_id);
        const squad = new SquadEntity();
        squad.name = dto.name;
        squad.armorForces = forces;
        return this.squadRepository.insert(dto);
    }

    async deleteSquad(id: string): Promise<void> {
        await this.squadRepository.delete(id);
    }

    async getAllRanks(
        dto: PaginationListDto
    ): Promise<[SquadRankEntity[], number]> {
        const [entities, total] = await this.rankRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._order,
        });
        return [entities, total];
    }
    findRankById(id: string): Promise<SquadRankEntity | null> {
        return this.rankRepository.findOneBy({ id });
    }
    async createRank(dto: SquadRankCreateDto) {
        const rank = new SquadRankEntity();
        rank.name = dto.name;
        rank.description = dto.description;
        rank.salary = new SalaryEntity();
        return this.rankRepository.insert(rank);
    }

    async deleteSquadRank(id: string): Promise<void> {
        await this.rankRepository.delete(id);
    }

    async getAllSquadMembers(
        dto: PaginationListDto
    ): Promise<[SquadMemberEntity[], number]> {
        const [entities, total] = await this.squadMemberRepository.findAndCount(
            {
                skip: dto._offset * dto._limit,
                take: dto._limit,
                order: dto._order,
            }
        );
        return [entities, total];
    }
    findSquadMemberById(id: string): Promise<SquadMemberEntity | null> {
        return this.squadMemberRepository.findOneBy({ id });
    }
    async createSquadMember(dto: SquadMemberCreateDto) {
        const rank = await this.findRankById(dto.rank_id);
        const character = await this.characterRepository.findOneBy({
            id: dto.character_id,
        });
        const squad = await this.findSquadById(dto.squad_id);
        const member = new SquadMemberEntity();
        member.rank = rank;
        member.character = character;
        member.squad = squad;
        return this.squadMemberRepository.insert(member);
    }

    async deleteSquadMember(id: string): Promise<void> {
        await this.squadMemberRepository.delete(id);
    }

    async getAllArmedForces(
        dto: PaginationListDto
    ): Promise<[ArmedForcesEntity[], number]> {
        const [entities, total] = await this.armedForcesRepository.findAndCount(
            {
                skip: dto._offset * dto._limit,
                take: dto._limit,
                order: dto._order,
            }
        );
        return [entities, total];
    }
    findArmedForcesById(id: string): Promise<ArmedForcesEntity | null> {
        return this.armedForcesRepository.findOneBy({ id });
    }
    async createArmedForces(dto: ArmedForcesCreateDto) {
        const armedForces = new ArmedForcesEntity();
        armedForces.name = dto.name;
        armedForces.descripiton = dto.description;
        return this.armedForcesRepository.insert(armedForces);
    }

    async deleteArmedForce(id: string): Promise<void> {
        await this.armedForcesRepository.delete(id);
    }
}
