import { IsNotEmpty } from 'class-validator';

export class PasswordUserDto {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly passwordNew: string;

  @IsNotEmpty()
  readonly passwordConfirm: string;
}