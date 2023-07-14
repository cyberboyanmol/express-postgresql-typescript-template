import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly avatar: string;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly activated: boolean;
}
