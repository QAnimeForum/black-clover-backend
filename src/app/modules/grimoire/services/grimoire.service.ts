import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrimoireDto } from '../dtos/create-grimoire.dto';
import { CharacterEntity } from '../../characters/entity/character.entity';
import { GrimoireEntity } from '../entity/grimoire.entity';

@Injectable()
export class GrimoireService {
    constructor(
        @InjectRepository(GrimoireEntity)
        private readonly grimoireRepository: Repository<GrimoireEntity>,
        @InjectRepository(CharacterEntity)
        private readonly characterRepository: Repository<CharacterEntity>
    ) {}

    async createGrimoire(dto: CreateGrimoireDto) {
        const characters = await this.characterRepository.findBy({
            id: dto.characterId,
        });
        const character = characters[0];
        const grimoireEntity = new GrimoireEntity();
        grimoireEntity.magicName = dto.magicName;
        grimoireEntity.magicColor = dto.magicColor;
        // grimoireEntity.coverSymbol =
        this.grimoireRepository.insert(grimoireEntity);
        character.grimoire = grimoireEntity;
        this.characterRepository.save(character);
    }
}
