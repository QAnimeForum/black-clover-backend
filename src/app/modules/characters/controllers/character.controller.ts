import { Controller, Get } from '@nestjs/common';

@Controller('character')
export class CharacterController {

    @Get()
    findAll(): string {
        return 'This action returns all character';
    }
}
