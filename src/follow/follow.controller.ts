import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser, Roles } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { UserRole } from 'types';
import { User } from '@prisma/client';
import { GetFollowDto } from './dto';

@Controller('follow')
@ApiTags('follow')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.ADMIN, UserRole.MEMBER, UserRole.AUTHOR)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  create(
    @ReqUser() currentUser: User,
    @Body() createFollowDto: CreateFollowDto,
  ) {
    return this.followService.create(currentUser, createFollowDto);
  }

  @Get()
  findAll(@ReqUser() currectUser: User, @Query() getFollowDto: GetFollowDto) {
    return this.followService.findAll(currectUser, getFollowDto);
  }

  @Get('/search')
  searchFollowedUsers(
    @ReqUser() currectUser: User,
    @Query() getFollowDto: GetFollowDto,
  ) {
    console.log('im here', getFollowDto);
    return this.followService.searchFollowedUsers(currectUser, getFollowDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followService.update(+id, updateFollowDto);
  }

  @Patch(':userId/unfollow')
  unfollowUser(@ReqUser() currentUser: User, @Param('userId') userId: string) {
    return this.followService.unfollow(currentUser, userId);
  }
}
