import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RaceEntity } from '../modules/race/entity/race.entity';
import { StateEntity } from '../modules/map/enitity/state.entity';
import { BackgroundEntity } from '../modules/character/entity/background.entity';
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
import { ENUM_IS_GRIMOIRE_APPROVED } from '../modules/grimoire/constants/grimoire.enum.constant';
import { CharacterCreateDto } from 'src/modules/character/dto/character.create.dto';
import * as wizard_king from '../../Assets/json/nps/wizard_king.json';
export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
      
    }
}
