import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Character } from '../domain/Character';

export class SortCharacterDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Character;

  @ApiProperty()
  @IsString()
  order: string;
}
