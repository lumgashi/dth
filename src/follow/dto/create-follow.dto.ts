import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsMongoId } from 'class-validator';

export class CreateFollowDto {
  //   @IsMongoId()
  //   @IsNotEmpty()
  //   @ApiProperty({
  //     description: 'The user id which is making the follow',
  //     example: '5f8f7e2c8d8f7e2c8d8f7e2c',
  //   })
  //   fromId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user id which is getting followed',
    example: '5f8f7e2c8d8f7e2c8d8f7e2c',
  })
  toId: string;

  //   @IsBoolean()
  //   @ApiProperty({
  //     description: 'Is the follow active or not',
  //     example: 'true/false',
  //   })
  //   isActive: boolean;
}
