import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';

@ApiTags('Character')
@Controller()
export class CharacterController {
  constructor(private service: CharacterService) {}
}
