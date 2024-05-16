import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DevilEntity } from '../modules/devils/entity/devil.entity';
import { devils } from '../../Assets/json/devlis.json';
import { DevilSpellEntity } from '../modules/devils/entity/devil.spell.entity';
import { DevilUnionEntity } from '../modules/devils/entity/devil.union.entity';
import { DevilUnionsPercentEnum } from '../modules/devils/constants/devil.union.percent.enum';
import { ENUM_DEVIL_RANK } from '../modules/devils/constants/devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from '../modules/devils/constants/devil.floor.enum';
export default class DevilSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const devilRepository = dataSource.getRepository(DevilEntity);
        const devilUnionRepository = dataSource.getRepository(DevilUnionEntity);
        const devilSpellsRepository =
            dataSource.getRepository(DevilSpellEntity);

        for (let i = 0; i < devils.length; ++i) {
            const {
                name,
                description,
                image_path,
                floor,
                rank,
                magic_type,
                union_10,
                union_25,
                union_50,
                union_65,
                union_80,
                union_100,
            } = devils[i];
            const devil_union_10 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_10,
                })
            ).raw[0];
            const devil_union_25 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_25,
                })
            ).raw[0];
            const devil_union_50 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_50,
                })
            ).raw[0];
            const devil_union_65 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_65,
                })
            ).raw[0];
            const devil_union_80 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_80,
                })
            ).raw[0];
            const devil_union_100 = (
                await devilUnionRepository.insert({
                    percent: DevilUnionsPercentEnum.PERCENT_100,
                })
            ).raw[0];

            await devilRepository.insert({
                name: name,
                description: description,
                image: image_path,
                rank: rank as ENUM_DEVIL_RANK,
                floor: floor as ENUM_DEVIL_FLOOR,
                magic_type: magic_type,
                union_10: devil_union_10,
                union_25: devil_union_25,
                union_50: devil_union_50,
                union_65: devil_union_65,
                union_80: devil_union_80,
                union_100: devil_union_100,
            });
            for (let j = 0; j < union_10.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_10.spells[j].name,
                    description: union_10.spells[j].description,
                    range: union_10.spells[j].range,
                    duration: union_10.spells[j].duration,
                    cost: union_10.spells[j].cost,
                    castTime: union_10.spells[j].castTime,
                    union: devil_union_10,
                });
            }

            for (let j = 0; j < union_25.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_25.spells[j].name,
                    description: union_25.spells[j].description,
                    range: union_25.spells[j].range,
                    duration: union_25.spells[j].duration,
                    cost: union_25.spells[j].cost,
                    castTime: union_25.spells[j].castTime,
                    union: devil_union_25,
                });
            }

            for (let j = 0; j < union_50.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_50.spells[j].name,
                    description: union_50.spells[j].description,
                    range: union_50.spells[j].range,
                    duration: union_50.spells[j].duration,
                    cost: union_50.spells[j].cost,
                    castTime: union_50.spells[j].castTime,
                    union: devil_union_50,
                });
            }

            for (let j = 0; j < union_65.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_65.spells[j].name,
                    description: union_65.spells[j].description,
                    range: union_65.spells[j].range,
                    duration: union_65.spells[j].duration,
                    cost: union_65.spells[j].cost,
                    castTime: union_65.spells[j].castTime,
                    union: devil_union_65,
                });
            }

            for (let j = 0; j < union_80.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_80.spells[j].name,
                    description: union_80.spells[j].description,
                    range: union_80.spells[j].range,
                    duration: union_80.spells[j].duration,
                    cost: union_80.spells[j].cost,
                    castTime: union_80.spells[j].castTime,
                    union: devil_union_80,
                });
            }
            for (let j = 0; j < union_100.spells.length; ++j) {
                await devilSpellsRepository.insert({
                    name: union_100.spells[j].name,
                    description: union_100.spells[j].description,
                    range: union_100.spells[j].range,
                    duration: union_100.spells[j].duration,
                    cost: union_100.spells[j].cost,
                    castTime: union_100.spells[j].castTime,
                    union: devil_union_100,
                });
            }
        }
    }
}
