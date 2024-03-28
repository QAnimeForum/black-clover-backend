import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEnity } from '../entity/user.entity';

@Controller('map')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/list')
    findAll(): Promise<UserEnity[]> {
        return this.userService.findAll();
        // return entities.map((devil) => DevilMapper.toDomain(devil));
    }

    create(dto: CreateUserDto) {
        return this.userService.create(dto);
    }
    findOne(id: string): Promise<UserEnity | null> {
        return this.userService.findOne(id);
    }

    async remove(id: string): Promise<void> {
        this.userService.remove(id);
    }
}
