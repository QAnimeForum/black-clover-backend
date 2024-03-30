import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CharacterEntity } from '../app/modules/characters/entity/character.entity';
export default class RaceSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const characterRepository = dataSource.getRepository(CharacterEntity);
    }
}
