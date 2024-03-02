import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/all-config.type';
import { CreateCharacterDto } from './dto/create.character.dto';
import { Character } from './domain/Character';
import { SortCharacterDto } from './dto/sort.character.dto';
import { FilterCharacterDto } from './dto/filter.character.dto';
import { DeepPartial } from 'typeorm';
import { EntityCondition } from 'src/types/entity-condition.type';
import { NullableType } from 'src/types/nullable.type';
import { IPaginationOptions } from 'src/types/pagination-options';
import { CharacterRepository } from './character.reposirory';

@Injectable()
export class CharacterService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersRepository: CharacterRepository,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const clonedPayload = {
      ...createCharacterDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.usersRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCharacterDto | null;
    sortOptions?: SortCharacterDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Character[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(
    fields: EntityCondition<Character>,
  ): Promise<NullableType<Character>> {
    return this.usersRepository.findOne(fields);
  }

  async update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: Character['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload: DeepPartial<Character>,
  ): Promise<Character | null> {
   // const clonedPayload = { ...payload };
    return  null;
  }

  async softDelete(id: Character['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
