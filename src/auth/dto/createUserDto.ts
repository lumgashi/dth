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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First Name should not be empty' })
  @ApiProperty({ example: 'John Doe' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last Name should not be empty' })
  @ApiProperty({ example: 'John Doe' })
  lastName: string;

  @IsEmail({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @Transform((param) => param.value.toLowerCase())
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @ApiProperty({ example: '+00012324323' })
  phoneNumber: string;

  //@IsStrongPassword({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @ApiProperty({ example: 'randompassword' })
  password: string;
}
