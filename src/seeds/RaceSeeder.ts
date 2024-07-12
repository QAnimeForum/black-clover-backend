import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { races } from '../../Assets/json/races.json';
import { RaceEntity } from '../modules/race/entity/race.entity';
export default class RaceSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const raceRepository = dataSource.getRepository(RaceEntity);
        for(let i = 0; i < races.length; ++i) {
            const race = races[i];
            console.log(race);
            await raceRepository.insert({
                name: race.name,
                description: race.description,
                bonusHp: Number.parseInt(race.bonus.hp),
                bonusMagicPower: Number.parseInt(race.bonus.magicPower),
            //    naturalMana: race.bonus.naturalMana,
              // increasedEndurance: race.bonus.increasedEndurance,
            });
        }
    }
}
