import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RaceEntity } from '../app/modules/characters/entity/race.entity';
import { CreateRaceDto } from '../app/modules/characters/dto/create-race.dto';
import { races } from '../../Assets/json/races.json';
export default class RaceSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const raceRepository = dataSource.getRepository(RaceEntity);
        const data: CreateRaceDto[] = races;
        await raceRepository.insert(data);
    }
}
