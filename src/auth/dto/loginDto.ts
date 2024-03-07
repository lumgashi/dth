import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNotIn,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @Transform((param) => param.value.toLowerCase())
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  //@IsStrongPassword({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @ApiProperty({ example: 'randompassword' })
  password: string;
}
