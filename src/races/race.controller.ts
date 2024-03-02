import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RaceService } from './race.service';

@ApiTags('Character')
@Controller()
export class RaceController {
  constructor(private service: RaceService) {}
}
