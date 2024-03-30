import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RaceEntity } from '../app/modules/characters/entity/race.entity';
import { CreateRaceDto } from '../app/modules/characters/dto/create-race.dto';
export default class RaceSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const raceRepository = dataSource.getRepository(RaceEntity);
        const data: CreateRaceDto[] = [
            {
                name: 'Человек',
                description: '',
            },
            {
                name: 'Ведьма',
                description: '',
            },
            {
                name: 'Гном',
                description: '',
            },
            {
                name: 'Демон',
                description: '',
            },
        ];
        await raceRepository.insert(data);
        /*
        const datsStates: CreateDevilDto[] = [
            {
                name: 'Нахема',
                description: '',
                floor: DevilFloorEnum.ONE,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия огня',
            },
            {
                name: 'Лилит',
                description: '',
                floor: DevilFloorEnum.ONE,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия льда',
            },
            {
                name: 'Адрамлелех',
                description: '',
                floor: DevilFloorEnum.TWO,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'нет данных',
            },
            {
                name: 'Баал',
                description: '',
                floor: DevilFloorEnum.THREE,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия погоды',
            },
            {
                name: 'Люцифугус',
                description: '',
                floor: DevilFloorEnum.SIX,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия тьмы',
            },
            {
                name: 'Вельзевул',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия пространства',
            },
            {
                name: 'Астарот',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия времени',
            },
            {
                name: 'Люциферо',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HighestRanking,
                magic_type: 'магия гравитации',
            },
            {
                name: 'Загред',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HighRanking,
                magic_type: 'магия души слова',
            },
            {
                name: 'Мегикула',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HighRanking,
                magic_type: 'магия проклятий',
            },
        ];
        await devilRepository.insert(create);*/
    }
}
