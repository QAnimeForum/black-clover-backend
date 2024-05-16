import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RaceEntity } from '../modules/race/entity/race.entity';
import { StateEntity } from '../modules/map/enitity/state.entity';
import { BackgroundEnity } from '../modules/character/entity/background.entity';
import { InventoryEntity } from '../modules/character/entity/inventory.entity';
import { GrimoireEntity } from '../modules/grimoire/entity/grimoire.entity';
import { AbilityEntity } from '../modules/character/entity/ability.entity';
import { ProficiencyEntity } from '../modules/character/entity/proficiency.entity';
import { CharacterCharacteristicsEntity } from '../modules/character/entity/character.characteristics.entity';
import { CashEntity } from '../modules/money/entity/cash.entity';
import { ArmorClassEntity } from '../modules/character/entity/armor.class.entity';
import { WalletEntity } from '../modules/money/entity/wallet.entity';
import { CharacterEntity } from '../modules/character/entity/character.entity';
import { ENUM_CHARCACTER_TYPE } from '../modules/character/constants/character.type.enum';
import { UserEntity } from '../modules/user/entities/user.entity';
import { ENUM_ROLE_TYPE } from '../modules/user/constants/role.enum.constant';
import { ENUM_IS_GRIMOIRE_APPROVED } from '../modules/grimoire/constants/grimoire.enum.constant';
import { CharacterCreateDto } from 'src/modules/character/dto/character.create.dto';
import * as wizard_king from '../../Assets/json/nps/wizard_king.json';
export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const userRepository = dataSource.getRepository(UserEntity);
        const me: CharacterCreateDto = {
            name: 'Яна',
            type: ENUM_CHARCACTER_TYPE.PC,
            age: 0,
            sex: 'ж',
            state: 'Клевер',
            race: 'Ведьма',
            magic: 'магия весов',
            height: 0,
            maxHealth: 0,
            currentLevel: 1,
            experience: 0,
            maxLevel: 0,
            proficiency: {
                level: 0,
                extraBonus: 0,
            },
            armorClass: {
                base: 0,
                bonus: 0,
            },
            abilities: {
                strength: {
                    score: 0,
                    modifier: 0,
                },
                dexterity: {
                    score: 0,
                    modifier: 0,
                },
                constitution: {
                    score: 0,
                    modifier: 0,
                },

                intelligence: {
                    score: 0,
                    modifier: 0,
                },
                wisdom: {
                    score: 0,
                    modifier: 0,
                },
                charisma: {
                    score: 0,
                    modifier: 0,
                },
            },
            cash: {
                cooper: 0,
                silver: 0,
                eclevtrum: 0,
                gold: 0,
                platinum: 0,
            },
        };
        const character = await this.insertCharacter(me, dataSource);
        await userRepository.insert({
            tgUserId: process.env.SUPER_ADMIN_ID,
            character: character,
            role: ENUM_ROLE_TYPE.SUPER_ADMIN,
        });
        /**
         * NPC
         */
        const wizardKingEnity = await this.insertCharacter(
            wizard_king as CharacterCreateDto,
            dataSource
        );
    }

    async insertCharacter(dto: CharacterCreateDto, dataSource: DataSource) {
        const raceRepository = dataSource.getRepository(RaceEntity);
        const stateRepository = dataSource.getRepository(StateEntity);
        const backgroundRepository = dataSource.getRepository(BackgroundEnity);
        const inventoryRepository = dataSource.getRepository(InventoryEntity);
        const grimoireRepository = dataSource.getRepository(GrimoireEntity);
        const abilityRepository = dataSource.getRepository(AbilityEntity);
        const proficiencyRepository =
            dataSource.getRepository(ProficiencyEntity);
        const characteristicsRepository = dataSource.getRepository(
            CharacterCharacteristicsEntity
        );
        const armorClassRepository = dataSource.getRepository(ArmorClassEntity);
        const cashRepository = dataSource.getRepository(CashEntity);
        const walletRepository = dataSource.getRepository(WalletEntity);
        const characterRepository = dataSource.getRepository(CharacterEntity);

        const races = await raceRepository.find({
            where: {
                name: dto.race,
            },
        });
        const states = await stateRepository.find({
            where: {
                name: dto.state,
            },
        });
        if (states.length == 0) {
            return;
        }
        const backgroundEntity = (
            await backgroundRepository.insert({
                name: dto.name,
                race: races[0],
                height: dto.height,
                sex: dto.sex,
                age: dto.age,
                state: states[0],
            })
        ).raw[0];

        /**
         * Создание инвенторя
         */
        const inventoryEntity = (await inventoryRepository.insert({})).raw[0];
        /**
         * Создание истории персонажа
         */

        const grimoireEntity = (
            await grimoireRepository.insert({
                magicName: dto.magic,
                coverSymbol: states[0].symbol,
                status: ENUM_IS_GRIMOIRE_APPROVED.NOT_APPROVED,
            })
        ).raw[0];
        const proficiency = (
            await proficiencyRepository.insert({
                level: 1,
                extraBonus: 0,
            })
        ).raw[0];

        // const strength: AbilityEntity = new AbilityEntity();
        const strengthEntity = (
            await abilityRepository.insert({
                //    name: 'Сила',
                //  abbr: '💪',
                score: dto.abilities.strength.score,
                modifier: dto.abilities.strength.modifier,
                //   characterCharacteristics: characteristitcsEntity,
            })
        ).raw[0];

        const dexterityEntity = (
            await abilityRepository.insert({
                //     name: 'Ловкость',
                ///     abbr: '🏃',
                score: dto.abilities.dexterity.score,
                modifier: dto.abilities.dexterity.modifier,
            })
        ).raw[0];

        const constitutionEntity = (
            await abilityRepository.insert({
                //     name: 'Телосложение',
                //     abbr: '🏋️',
                score: dto.abilities.constitution.score,
                modifier: dto.abilities.constitution.modifier,
            })
        ).raw[0];

        const intelligenceEntity = (
            await abilityRepository.insert({
                //     name: 'Интеллект',
                //      abbr: '🎓',
                score: dto.abilities.intelligence.score,
                modifier: dto.abilities.intelligence.modifier,
            })
        ).raw[0];

        const wisdomEntity = (
            await abilityRepository.insert({
                //      name: 'Мудрость',
                //      abbr: '📚',
                score: dto.abilities.wisdom.score,
                modifier: dto.abilities.wisdom.modifier,
            })
        ).raw[0];

        const charismaEntity = (
            await abilityRepository.insert({
                //      name: 'Харизма',
                //      abbr: '🗣',
                score: dto.abilities.charisma.score,
                modifier: dto.abilities.charisma.modifier,
            })
        ).raw[0];
        /**
         * класс защиты
         */
        const armorClassEntity = (
            await armorClassRepository.insert({
                base: dto.armorClass.base,
                bonus: dto.armorClass.bonus,
            })
        ).raw[0];
        const characteristitcsEntity = (
            await characteristicsRepository.insert({
                currentHealth: dto.maxHealth,
                maxHealth: dto.maxHealth,
                currentLevel: dto.currentLevel,
                experience: dto.experience,
                maxLevel: dto.maxLevel,
                hunger: 0,
                sanity: 100,
                proficiency: proficiency,
                strength: strengthEntity,
                dexterity: dexterityEntity,
                constitution: constitutionEntity,
                intelligence: intelligenceEntity,
                wisdom: wisdomEntity,
                charisma: charismaEntity,
                armorClass: armorClassEntity,
            })
        ).raw[0];

        const cashEntity = (
            await cashRepository.insert({
                cooper: dto.cash.cooper,
                silver: dto.cash.silver,
                eclevtrum: dto.cash.eclevtrum,
                gold: dto.cash.gold,
                platinum: dto.cash.platinum,
            })
        ).raw[0];
        const wallet = (
            await walletRepository.insert({
                cash: cashEntity,
            })
        ).raw[0];
        const character = (
            await characterRepository.insert({
                type: dto.type,
                background: backgroundEntity,
                characterCharacteristics: characteristitcsEntity,
                grimoire: grimoireEntity,
                inventory: inventoryEntity,
                wallet: wallet,
            })
        ).raw[0];
        return character;
    }
}
