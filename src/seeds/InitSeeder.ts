import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import DevilSeeder from './DevilSeeder';
import StateSeeder from './mapSeeds/StateSeeder';

export default class InitSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        await runSeeders(dataSource, {
            seeds: [DevilSeeder, StateSeeder],
        });
    }
}
