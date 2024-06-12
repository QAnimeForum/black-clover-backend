import { Inject, Injectable } from '@nestjs/common';
import { PlantEntity } from '../entity/plant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PotEntity } from '../entity/pot.entity';
import { GardenEntity } from '../entity/garden.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CharacterEntity } from 'src/modules/character/entity/character.entity';
import { CharacterService } from 'src/modules/character/services/character.service';

export enum PlantStage {
    JustPlantedRecently = 1,
    Little = 2,
    Mid = 3,
    Grown = 4,
}

export class PlantCreateDto {
    name: string;
    emojiIcon: string;
    description: string;
    costMoney: number;
    salePrice: number;
    wateringInterval: number;
    deathTime: number;
}
@Injectable()
export class PlantService {
    constructor(
        @Inject(CharacterService)
        private readonly characterService: CharacterService,
        @InjectRepository(GardenEntity)
        private readonly gardenRepository: Repository<GardenEntity>,
        @InjectRepository(PlantEntity)
        private readonly plantRepository: Repository<PlantEntity>,
        @InjectRepository(PotEntity)
        private readonly potRepository: Repository<PotEntity>
    ) {}

    async findGardenByUserTgId(tgUserId: number): Promise<GardenEntity> {
        const query: string = `select garden.* from garden JOIN character ON garden.id = character.garden_id JOIN game_user on character.id = game_user.character_id  where game_user.tg_user_id = ${tgUserId}`;
        const gardens: Array<GardenEntity> =
            await this.gardenRepository.query(query);
        if (gardens.length !== 1) {
            return null;
        }
        return gardens[0];
    }

    async findPotById(id: string) {
        return this.potRepository.findOneBy({
            id: id,
        });
    }
    async createPlant(dto: PlantCreateDto) {
        const plant = new PlantEntity();
        plant.name = dto.name;
        plant.emojiIcon = dto.emojiIcon;
        plant.description = dto.description;
        plant.costMoney = dto.costMoney;
        plant.salePrice = dto.salePrice;
        plant.deathTime = dto.deathTime;
        this.plantRepository.save(plant);
    }

    async createGarden(tgId: number) {
        const character = await this.characterService.findCharacterByTgId(tgId);
        const garden = new GardenEntity();
        const pot1 = new PotEntity();
        await this.potRepository.insert(pot1);
        const pot2 = new PotEntity();

        await this.potRepository.insert(pot2);
        const pot3 = new PotEntity();

        await this.potRepository.insert(pot3);
        const pot4 = new PotEntity();

        await this.potRepository.insert(pot4);
        const pot5 = new PotEntity();
        await this.potRepository.insert(pot5);
        garden.pot_1 = pot1;
        garden.pot_2 = pot2;
        garden.pot_3 = pot3;
        garden.pot_4 = pot4;
        garden.pot_5 = pot5;
        console.log(garden);
        await this.gardenRepository.save(garden);
        character.garden = garden;
        character.gardenId = garden.id;
        this.characterService.updateCharacter(character);
        return garden;
    }
    async delete(id: string): Promise<void> {
        const result = await this.plantRepository.findBy({ id: id });
        if (result.length > 0) {
            this.plantRepository.delete(id);
        } else {
            throw Error('No avatar with such link!');
        }
    }

    async findAllPlants(): Promise<PlantEntity[]> {
        return await this.plantRepository.find();
    }

    async getPlantById(id: string): Promise<PlantEntity> {
        const result: PlantEntity[] = await this.plantRepository.findBy({
            id: id,
        });
        if (result.length) {
            return result[0];
        } else {
            throw Error('No user with such id');
        }
    }

    async addPlantToUserPot(
        gardenId: string,
        plantId: string,
        potNumber: number
    ) {
        const garden = await this.gardenRepository.findOneBy({
            id: gardenId,
        });

        if (!garden) {
            return;
        }

        const plants: PlantEntity[] = await this.plantRepository.findBy({
            id: plantId,
        });

        if (!plants.length) {
            return;
        }
        const plant = plants[0];

        if (!garden || !plant) {
            throw new Error('User or Plant not found');
        }

        let pot: PotEntity | null = null;

        switch (potNumber) {
            case 1:
                pot = garden?.pot_1;
                break;
            case 2:
                pot = garden?.pot_2;
                break;
            case 3:
                pot = garden?.pot_3;
                break;
            case 4:
                pot = garden?.pot_4;
                break;
            case 5:
                pot = garden?.pot_5;
                break;
        }

        if (!pot) {
            pot = new PotEntity();
            pot.plant = plant;
            pot.stage = PlantStage.JustPlantedRecently;
            pot.nextWatering = new Date();
            pot.liveUntil = new Date(
                new Date().getTime() + plant.deathTime * 60000
            );
        } else {
            pot.plant = plant;
            pot.stage = PlantStage.JustPlantedRecently;
            pot.nextWatering = new Date();
            pot.liveUntil = new Date(
                new Date().getTime() + plant.deathTime * 60000
            );
        }

        await this.potRepository.save(pot);

        switch (potNumber) {
            case 1:
                garden.pot_1 = pot;
                break;
            case 2:
                garden.pot_2 = pot;
                break;
            case 3:
                garden.pot_3 = pot;
                break;
            case 4:
                garden.pot_4 = pot;
                break;
            case 5:
                garden.pot_5 = pot;
                break;
        }

        await this.gardenRepository.save(garden);
    }

    async waterPlant(gardenId: string, potNumber: number) {
        const garden = await this.gardenRepository.findOneBy({
            id: gardenId,
        });

        if (!garden) {
            throw new Error('User not found');
        }

        let pot: PotEntity | null = null;

        switch (potNumber) {
            case 1:
                pot = garden?.pot_1;
                break;
            case 2:
                pot = garden?.pot_2;
                break;
            case 3:
                pot = garden?.pot_3;
                break;
            case 4:
                pot = garden?.pot_4;
                break;
            case 5:
                pot = garden?.pot_5;
                break;
        }

        if (!pot || !pot.plant) {
            throw new Error('Pot or plant not found');
        }

        if (pot.stage < PlantStage.Grown) {
            if (pot.nextWatering && pot.nextWatering < new Date()) {
                pot.stage += 1;
            }
            pot.nextWatering = new Date(
                new Date().getTime() + pot.plant.wateringInterval * 60000
            );
            pot.liveUntil = new Date(
                pot.nextWatering.getTime() + pot.plant.deathTime * 60000
            );
            await this.potRepository.save(pot);
        }
    }

    async harvePlant(gardenId: string, potNumber: number): Promise<number> {
        const garden = await this.gardenRepository.findOneBy({
            id: gardenId,
        });
        if (!garden) {
            throw new Error('User not found');
        }

        let pot: PotEntity | null = null;

        switch (potNumber) {
            case 1:
                pot = garden?.pot_1;
                break;
            case 2:
                pot = garden?.pot_2;
                break;
            case 3:
                pot = garden?.pot_3;
                break;
            case 4:
                pot = garden?.pot_4;
                break;
            case 5:
                pot = garden?.pot_5;
                break;
        }
        if (!pot) {
            throw new Error('Pot not found');
        }
        if (!pot.plant) {
            throw new Error('Plant not found');
        }
        const bias = Math.floor(Math.random() * 5);
        const sale = Math.round((pot.stage * (pot.plant.salePrice + bias)) / 4);
        //   await UserService.getMoney(userId, sale);
        pot.plant = null;
        pot.stage = 0;
        pot.nextWatering = null;
        pot.liveUntil = null;
        await this.potRepository.save(pot);
        return sale;
    }
}
