import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @ApiProperty({ description: 'Number of page', example: '1' })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Limit per page', example: '10' })
  @IsOptional()
  limit?: number;

  @IsOptional()
  pagination?: boolean;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User handle',
    example: '@user134534535',
  })
  @IsOptional()
  @IsString()
  handle?: string;
}
