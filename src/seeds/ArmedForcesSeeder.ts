import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { clover } from '../../Assets/json/armedForces/clover-armed-forces.json';
import { squads } from '../../Assets/json/armedForces/default-squad.json';
import { ArmedForcesEntity } from '../modules/jobs/squards/entity/armed.forces.entity';
import { StateEntity } from '../modules/map/enitity/state.entity';
import { SalaryEntity } from '../modules/money/entity/amount.entity';
import { SquadEntity } from '../modules/jobs/squards/entity/squad.entity';
import { ArmedForcesRankEntity } from '../modules/jobs/squards/entity/armed.forces.rank.entity';
export default class ArmedForcesSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const armedForcesRepository =
            dataSource.getRepository(ArmedForcesEntity);
        const salaryRepository = dataSource.getRepository(SalaryEntity);
        const statesRepository = dataSource.getRepository(StateEntity);
        const squadsRepository = dataSource.getRepository(SquadEntity);
        const rankRepository = dataSource.getRepository(ArmedForcesRankEntity);
        const state = await statesRepository.findOne({
            where: {
                name: 'Клевер',
            },
        });
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

        for (let i = 0; i < squads.length; ++i) {
            await squadsRepository.insert({
                name: squads[i].name,
                description: squads[i].description,
                image: squads[i].image,
                armorForces: cloverArmedForcesEntity,
            });
        }
    }
}
