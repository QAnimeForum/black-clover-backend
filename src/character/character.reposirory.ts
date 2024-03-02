import { FindOptionsWhere, Repository } from 'typeorm';
import { Character } from './domain/Character';
import { FilterCharacterDto } from './dto/filter.character.dto';
import { SortCharacterDto } from './dto/sort.character.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterEntity } from './entity/character.entity';
import { CharacterMapper } from './character.mapper';
import { EntityCondition } from 'src/types/entity-condition.type';
import { NullableType } from 'src/types/nullable.type';
import { IPaginationOptions } from 'src/types/pagination-options';

export class CharacterRepository {
  constructor(
    @InjectRepository(CharacterEntity)
    private readonly characterRepository: Repository<CharacterEntity>,
  ) {}

  async create(data: Partial<Character>): Promise<Character> {
    const persistenceModel = CharacterMapper.toPersistence(data);
    const newEntity = await this.characterRepository.save(
      this.characterRepository.create(persistenceModel),
    );
    return CharacterMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCharacterDto | null;
    sortOptions?: SortCharacterDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Character[]> {
    const where: FindOptionsWhere<CharacterEntity> = {};

    const entities = await this.characterRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => CharacterMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<Character>,
  ): Promise<NullableType<Character>> {
    const entity = await this.characterRepository.findOne({
      where: fields as FindOptionsWhere<CharacterEntity>,
    });

    return entity ? CharacterMapper.toDomain(entity) : null;
  }

  async update(
    id: Character['id'],
    payload: Partial<Character>,
  ): Promise<Character | null> {
    const entity = await this.characterRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Character not found');
    }

    const updatedEntity = await this.characterRepository.save(
      this.characterRepository.create(
        CharacterMapper.toPersistence({
          ...CharacterMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );
    return CharacterMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Character['id']): Promise<void> {
    await this.characterRepository.softDelete(id);
  }
}
