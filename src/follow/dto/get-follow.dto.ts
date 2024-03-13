import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetFollowDto {
  @ApiProperty({ description: 'Number of page', example: '1' })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Limit per page', example: '10' })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: 'Pagination', example: 'true/false' })
  @IsOptional()
  pagination?: boolean;

  @ApiProperty({
    description: 'Handle to search users',
    example: '@newuserherer',
  })
  @IsString()
  @IsOptional()
  userHandle?: string;
}
