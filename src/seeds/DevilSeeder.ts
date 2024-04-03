import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DevilEntity } from '../app/modules/devils/entity/devil.entity';
import { CreateDevilDto } from '../app/modules/devils/dtos/create.devil.dto';
import { devils } from '../../Assets/Devlis.json';
import { DevilFloorEnum } from 'src/app/modules/devils/constants/devil.flor.enum';
import { DevilRanksEnum } from 'src/app/modules/devils/constants/devil.ranks.enum';
export default class DevilSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const devilRepository = dataSource.getRepository(DevilEntity);

        const datsStates: CreateDevilDto[] = devils;
        const create: DevilEntity[] = datsStates.map(
            ({ name, description, floor, rank, magic_type }) => {
                const entity: DevilEntity = new DevilEntity();
                entity.name = name;
                entity.description = description;
                entity.rank = DevilRanksEnum[rank];
                entity.floor = DevilFloorEnum[floor];
                entity.description = description;
                entity.magic_type = magic_type;
                return entity;
            }
        );
        await devilRepository.insert(create);
    }
}
