import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpellEntity } from '../entity/spell.entity';
import { GrimoireEntity } from '../entity/grimoire.entity';
@Injectable()
export class GrimoireService {
    constructor(
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(SpellEntity)
        private readonly spellRepository: Repository<SpellEntity>
    ) {}

    async getGrimoireById(backgroundId: string): Promise<GrimoireEntity> {
        const entity = await this.grimoireRepository.findOneBy({
            id: backgroundId,
        });
        return entity;
    }
/*
    findSpells(dto: GetSpellsDto) {
        return this.spellRepository.findBy({
            id: dto.grimoireId,
        });
    }*/
}
