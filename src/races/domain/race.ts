import { Allow, IsNumber, IsString } from 'class-validator';

export class Role {
  @IsNumber()
  id: number;

  @IsString()
  @Allow()
  name?: string;
}
