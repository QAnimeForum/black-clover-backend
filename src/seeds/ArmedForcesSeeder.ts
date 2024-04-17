import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { clover } from '../../Assets/json/armedForces/clover-armed-forces.json';
import { ArmedForcesEntity } from '../app/modules/jobs/squards/entity/armed.forces.entity';
import { SquadRankEntity } from '../app/modules/jobs/squards/entity/squad.rank.entity';
import { StateEntity } from '../app/modules/map/enitity/state.entity';
import { SalaryEntity } from '../app/modules/money/entity/amount.entity';
export default class ArmedForcesSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const armedForcesRepository =
            dataSource.getRepository(ArmedForcesEntity);
        const salaryRepository = dataSource.getRepository(SalaryEntity);

        const statesRepository = dataSource.getRepository(StateEntity);
        const state = await statesRepository.findOne({
            where: {
                name: 'Клевер',
            },
        });
        //  const squadsRepository = dataSource.getRepository(SquadEntity);
        const rankRepository = dataSource.getRepository(SquadRankEntity);
        const cloverArmedForcesEntity = (
            await armedForcesRepository.insert({
                name: clover.name,
                descripiton: clover.description,
                state: state,
            })
        ).raw[0];
        const ranksDto = clover.ranks;
        for (let i = 0; i < ranksDto.length; ++i) {
            const rank = ranksDto[i];
            const salary = (
                await salaryRepository.insert({
                    cooper: ranksDto[i].salary.cooper,
                    platinum: ranksDto[i].salary.platinum,
                    eclevtrum: ranksDto[i].salary.eclevtrum,
                    silver: ranksDto[i].salary.silver,
                    gold: ranksDto[i].salary.gold,
                })
            ).raw[0];
            await rankRepository.insert({
                name: rank.name,
                description: rank.description,
                armorForces: cloverArmedForcesEntity,
                salary: salary,
            });
        }
    }
}
