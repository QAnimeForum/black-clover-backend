import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/all-config.type';

@Injectable()
export class RaceService {
  constructor(private configService: ConfigService<AllConfigType>) {}
}
