import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
