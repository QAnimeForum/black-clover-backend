import { InventoryEntity } from '../modules/items/entity/inventory.entity';
import { ENUM_CHARCACTER_TYPE } from '../modules/character/constants/character.type.enum';
import { AbilityEntity } from '../modules/character/entity/ability.entity';
import { ArmorClassEntity } from '../modules/character/entity/armor.class.entity';
import { BackgroundEntity } from '../modules/character/entity/background.entity';
import { CharacterCharacteristicsEntity } from '../modules/character/entity/character.characteristics.entity';
import { CharacterEntity } from '../modules/character/entity/character.entity';
import { ProficiencyEntity } from '../modules/character/entity/proficiency.entity';
import { GrimoireEntity } from '../modules/grimoire/entity/grimoire.entity';
import { StateEntity } from '../modules/map/enitity/state.entity';
import { WalletEntity } from '../modules/money/entity/wallet.entity';
import { RaceEntity } from '../modules/race/entity/race.entity';
import {
    ENUM_USER_PERMISSION_TYPE,
    UserEntity,
} from '../modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { EquipmentEntity } from '../modules/items/entity/equipment.entity';

export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const userRepository = dataSource.getRepository(UserEntity);
        const characterRepository = dataSource.getRepository(CharacterEntity);
        const raceRepository = dataSource.getRepository(RaceEntity);

        const inventoryRepository = dataSource.getRepository(InventoryEntity);
        const equipmentRepository = dataSource.getRepository(EquipmentEntity);
        
        const grimoireRepository = dataSource.getRepository(GrimoireEntity);
        const stateRepository = dataSource.getRepository(StateEntity);
        const backgroundRepository = dataSource.getRepository(BackgroundEntity);
        const walletRepository = dataSource.getRepository(WalletEntity);
        const abilityRepository = dataSource.getRepository(AbilityEntity);
        const armorClassRepository = dataSource.getRepository(ArmorClassEntity);
        const proficiencyRepository =
            dataSource.getRepository(ProficiencyEntity);
        const characteristitcsRepository = dataSource.getRepository(
            CharacterCharacteristicsEntity
        );
        const character = new CharacterEntity();

        const inventory = new InventoryEntity();
        await inventoryRepository.save(inventory);
        const equipment = new EquipmentEntity();
        await equipmentRepository.save(equipment);
        /**
         * Создание истории персонажа
         */
        const state = await stateRepository.findOneBy({
            symbol: '♠️',
        });
        const race = await raceRepository.findOneBy({
            name: 'Человек',
        });
        const coverSymbol = '♠️';
        const grimoire = new GrimoireEntity();
        grimoire.magicName = 'магия весов';
        grimoire.coverSymbol = coverSymbol;
        grimoireRepository.save(grimoire);
        const background = new BackgroundEntity();
        background.name = 'не заполнено';
        background.age = 12;
        background.sex = 'ж';
        background.history = 'не заполнено';
        background.hobbies = 'не заполнено';
        background.goals = 'не заполнено';
        background.worldview = 'не заполнено';
        background.characterTraits = 'не заполнено';
        background.ideals = 'не заполнено';
        background.attachments = 'не заполнено';
        background.weaknesses = 'не заполнено';
        background.quotes = [];
        background.appearance = 'не заполнено';
        background.raceId = race.id;
        background.stateId = state.id;
        await backgroundRepository.save(background);

        const proficiency = new ProficiencyEntity();
        proficiency.level = 1;
        proficiency.extraBonus = 0;
        await proficiencyRepository.save(proficiency);

        const strengthEntity = new AbilityEntity();
        strengthEntity.score = 10;
        strengthEntity.modifier = 0;
        await abilityRepository.save(strengthEntity);

        const dexterityEntity = new AbilityEntity();
        dexterityEntity.score = 10;
        dexterityEntity.modifier = 0;
        await abilityRepository.save(dexterityEntity);

        const constitutionEntity = new AbilityEntity();
        constitutionEntity.score = 10;
        constitutionEntity.modifier = 0;
        await abilityRepository.save(constitutionEntity);

        const intelligenceEntity = new AbilityEntity();
        intelligenceEntity.score = 10;
        intelligenceEntity.modifier = 0;
        await abilityRepository.save(intelligenceEntity);

        const wisdomEntity = new AbilityEntity();
        wisdomEntity.score = 10;
        wisdomEntity.modifier = 0;
        await abilityRepository.save(wisdomEntity);

        const charismaEntity = new AbilityEntity();
        charismaEntity.score = 10;
        charismaEntity.modifier = 0;
        await abilityRepository.save(charismaEntity);
        /**
         * класс защиты
         */
        const armorClassEntity = new ArmorClassEntity();
        armorClassEntity.base = 10;
        armorClassEntity.bonus = 0;
        await armorClassRepository.save(armorClassEntity);

        const characteristitcsEntity = new CharacterCharacteristicsEntity();
        characteristitcsEntity.currentHealth = 500;
        characteristitcsEntity.maxHealth = 500;
        characteristitcsEntity.currentLevel = 1;
        characteristitcsEntity.magicPower = 500;
        characteristitcsEntity.experience = 0;
        characteristitcsEntity.maxLevel = 20;
        characteristitcsEntity.hunger = 0;
        characteristitcsEntity.sanity = 0;
        characteristitcsEntity.proficiency = proficiency;
        characteristitcsEntity.strength = strengthEntity;
        characteristitcsEntity.dexterity = dexterityEntity;
        characteristitcsEntity.constitution = constitutionEntity;
        characteristitcsEntity.intelligence = intelligenceEntity;
        characteristitcsEntity.wisdom = wisdomEntity;
        characteristitcsEntity.charisma = charismaEntity;
        characteristitcsEntity.armorClass = armorClassEntity;
        await characteristitcsRepository.save(characteristitcsEntity);

        const wallet = new WalletEntity();
        wallet.copper = 0;
        wallet.silver = 0;
        wallet.electrum = 0;
        wallet.gold = 0;
        wallet.platinum = 0;
        wallet.useElectrum = false;
        wallet.usePlatinum = false;
        await walletRepository.save(wallet);
        character.type = ENUM_CHARCACTER_TYPE.PC;
        character.avatar = 'avatar.jpg';
        character.backgroundId = background.id;
        character.characterCharacteristicsId = characteristitcsEntity.id;
        character.grimoire = null;
        character.equipmentId = equipment.id;
      //  character.grimoireId = grimoire.id;
        character.inventoryId = inventory.id;
        character.walletId = wallet.id;
        character.prodigy = false;

        await characterRepository.save(character);
        const user = new UserEntity();
        user.tgUserId = '237798019';
        user.characterId = character.id;
        user.type = ENUM_USER_PERMISSION_TYPE.OWNER;
        await userRepository.save(user);
    }
}
