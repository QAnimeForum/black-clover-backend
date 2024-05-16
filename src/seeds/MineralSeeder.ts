import { MineralEntity } from '../modules/jobs/mines/entities/mineral.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { minerals } from '../../Assets/json/items/mineral.json';
export default class MineralSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        console.log(minerals);
        const mineralRepository = dataSource.getRepository(MineralEntity);
        for (let i = 0; i < minerals.length; ++i) {
            const item = minerals[i];
            await mineralRepository.insert({
                name: item.name,
                description: item.description,
                image: item.image,
            });
        }
    }
}
