import { CharacterEntity } from './entity/character.entity';
import { Character } from './domain/Character';

export class CharacterMapper {
  static toDomain(raw: CharacterEntity): Character {
    const character = new Character();
    character.id = raw.id;
    character.createdAt = raw.createdAt;
    character.updatedAt = raw.updatedAt;
    character.deletedAt = raw.deletedAt;
    return character;
  }

  static toPersistence(character: Partial<Character>): CharacterEntity {
    const characterEntity = new CharacterEntity();
    if (character.id && typeof character.id === 'number') {
      characterEntity.id = character.id;
    }
    characterEntity.createdAt = character.createdAt;
    characterEntity.updatedAt = character.updatedAt;
    characterEntity.deletedAt = character.deletedAt;
    return characterEntity;
  }
}
