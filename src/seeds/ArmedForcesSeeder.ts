import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { clover } from '../../Assets/json/armedForces/clover-armed-forces.json';
import { squads } from '../../Assets/json/armedForces/default-squad.json';
import { ArmedForcesEntity } from '../modules/squards/entity/armed.forces.entity';
import { StateEntity } from '../modules/map/enitity/state.entity';
import { SquadEntity } from '../modules/squards/entity/squad.entity';
import { ArmedForcesRankEntity } from '../modules/squards/entity/armed.forces.rank.entity';
import { MoneyEntity } from '../modules/money/entity/money.entity';
export default class ArmedForcesSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const armedForcesRepository =
            dataSource.getRepository(ArmedForcesEntity);
        const moneyRepositorty = dataSource.getRepository(MoneyEntity);
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
                description: clover.description,
                state: state,
            })
        ).raw[0];
        const ranksDto = clover.ranks;
        let parent = null;
        for (let i = 0; i < ranksDto.length; ++i) {
            const rank = ranksDto[i];
             const salary = (
                await moneyRepositorty.insert({
                    copper: ranksDto[i].salary.copper,
                    platinum: ranksDto[i].salary.platinum,
                    eclevtrum: ranksDto[i].salary.eclevtrum,
                    silver: ranksDto[i].salary.silver,
                    gold: ranksDto[i].salary.gold,
                })
            ).raw[0];
            parent = (
                await rankRepository.insert({
                    name: rank.name,
                    description: rank.description,
                    armorForces: cloverArmedForcesEntity,
                    parent: parent,
                    salary: salary,
                })
            ).raw[0];
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
