import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'User phone number', example: '+123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'URL of user profile picture',
    example: 'https://example.com/profile-pic.jpg',
  })
  @IsOptional()
  @IsString()
  profilePicUrl?: string;

  @ApiProperty({
    description: 'URL of user banner picture',
    example: 'https://example.com/banner-pic.jpg',
  })
  @IsOptional()
  @IsString()
  bannerPicUrl?: string;

  @ApiProperty({
    description: 'User biography',
    example: 'A software developer passionate about coding',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'User handle',
    example: '@user134534535',
  })
  @IsOptional()
  @IsString()
  handle?: string;
}
