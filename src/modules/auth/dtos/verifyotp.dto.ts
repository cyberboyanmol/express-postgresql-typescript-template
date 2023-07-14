import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly hash: string;

  @IsNotEmpty()
  @IsNumber()
  readonly otp: number;
}
