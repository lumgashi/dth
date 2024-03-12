import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ActionTypes } from 'types';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(ActionTypes))
  actionType: string;
}
