import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import MapSeeder from './MapSeeder';
import DevilSeeder from './DevilSeeder';

export default class InitSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        await runSeeders(dataSource, {
            seeds: [DevilSeeder, MapSeeder],
        });
    }
}
