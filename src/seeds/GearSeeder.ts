import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class GearSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {}
}
