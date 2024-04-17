import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import DevilSeeder from './DevilSeeder';
import MapSeeder from './MapSeeder';
import RaceSeeder from './RaceSeeder';
import ArmedForcesSeeder from './ArmedForcesSeeder';
import MineralSeeder from './MineralSeeder';
import SprirtSeeder from './SpiritSeeder';
export default class InitSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        await runSeeders(dataSource, {
            seeds: [
                DevilSeeder,
                MapSeeder,
                RaceSeeder,
                SprirtSeeder,
                ArmedForcesSeeder,
                MineralSeeder,
            ],
        });
    }
}
