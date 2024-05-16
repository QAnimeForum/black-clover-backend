import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { races } from '../../Assets/json/races.json';
import { RaceEntity } from '../modules/race/entity/race.entity';
import { CreateRaceDto } from '../modules/race/dto/create-race.dto';
export default class RaceSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const raceRepository = dataSource.getRepository(RaceEntity);
        const data: CreateRaceDto[] = races;
        await raceRepository.insert(data);
    }
}
