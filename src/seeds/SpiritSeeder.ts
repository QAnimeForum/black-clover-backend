import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { spirits } from '../../Assets/json/spirits.json';
import { SpiritEntity } from '../modules/spirits/entity/spirit.entity';
export default class SprirtSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const spiritRepository = dataSource.getRepository(SpiritEntity);
        for (let i = 0; i < spirits.length; ++i) {
            const spirit = spirits[i];
            await spiritRepository.insert({
                name: spirit.name,
                description: spirit.description,
                image: spirit.image,
            });
        }
    }
}
