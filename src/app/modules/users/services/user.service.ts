import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEnity } from '../entity/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: Repository<UserEnity>) {}

    findAll(): Promise<UserEnity[]> {
        return this.userRepository.find();
        // return entities.map((devil) => DevilMapper.toDomain(devil));
    }

    create(dto: CreateUserDto) {
        const entity = new UserEnity();
        entity.telegram_id = dto.telegramId;
        return this.userRepository.insert(entity);
    }
    findOne(id: string): Promise<UserEnity | null> {
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
