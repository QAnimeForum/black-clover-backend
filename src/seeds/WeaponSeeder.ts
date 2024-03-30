import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class WeaponSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {}
}
