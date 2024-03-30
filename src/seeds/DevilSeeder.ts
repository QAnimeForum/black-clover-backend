import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DevilEntity } from '../app/modules/devils/entity/devil.entity';
import { CreateDevilDto } from '../app/modules/devils/dtos/create.devil.dto';
import { DevilRanksEnum } from '../app/modules/devils/constants/devil.ranks.enum';
import { DevilFloorEnum } from '../app/modules/devils/constants/devil.flor.enum';
export default class DevilSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const devilRepository = dataSource.getRepository(DevilEntity);

        const datsStates: CreateDevilDto[] = [
            {
                name: 'Нахема',
                description: '',
                floor: DevilFloorEnum.ONE,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия огня',
            },
            {
                name: 'Лилит',
                description: '',
                floor: DevilFloorEnum.ONE,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия льда',
            },
            {
                name: 'Адрамлелех',
                description: '',
                floor: DevilFloorEnum.TWO,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'нет данных',
            },
            {
                name: 'Баал',
                description: '',
                floor: DevilFloorEnum.THREE,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия погоды',
            },
            {
                name: 'Люцифугус',
                description: '',
                floor: DevilFloorEnum.SIX,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия тьмы',
            },
            {
                name: 'Вельзевул',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия пространства',
            },
            {
                name: 'Астарот',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия времени',
            },
            {
                name: 'Люциферо',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HIGHEST,
                magic_type: 'магия гравитации',
            },
            {
                name: 'Загред',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HIGH,
                magic_type: 'магия души слова',
            },
            {
                name: 'Мегикула',
                description: '',
                floor: DevilFloorEnum.SEVEN,
                rank: DevilRanksEnum.HIGH,
                magic_type: 'магия проклятий',
            },
        ];
        const create: DevilEntity[] = datsStates.map(
            ({ name, description, floor, rank, magic_type }) => {
                const entity: DevilEntity = new DevilEntity();
                entity.name = name;
                entity.description = description;
                entity.rank = rank;
                entity.floor = floor;
                entity.description = description;
                entity.magic_type = magic_type;
                return entity;
            }
        );
        await devilRepository.insert(create);
    }
}
