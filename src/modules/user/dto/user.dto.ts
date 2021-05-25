import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Exclude()
  password: string;

  @IsNotEmpty()
  mcuToken: string;

  @IsNotEmpty()
  lastAction: string;

  @IsNotEmpty()
  automationEnable: boolean;

  @IsNotEmpty()
  automationParameter: string;

  @IsNotEmpty()
  automationAttemp: number;

  @IsNotEmpty()
  routineTaskEnable: boolean;

  @IsNotEmpty()
  routineTaskTime: string;

  @IsNotEmpty()
  routineTaskSkipIfExceedParameter: boolean;
}