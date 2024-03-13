import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginateService } from 'src/paginate/paginate.service';
import { customResponse } from 'src/utils/functions';
import { Follow, Prisma, User } from '@prisma/client';
import { SuccessResponse, ErrorResponse } from 'types';
import { GetFollowDto } from './dto';

@Injectable()
export class FollowService {
  constructor(
    private prisma: PrismaService,
    private paginate: PaginateService,
  ) {}
  async create(
    currentUser: User,
    createFollowDto: CreateFollowDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    const { toId } = createFollowDto;

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: toId,
        isActive: true,
      },
    });

    if (!userExists) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'User does not exist',
        }),
      );
    }

    const followExists = await this.prisma.follow.findFirst({
      where: {
        fromId: currentUser.id,
        toId,
      },
    });

    if (followExists.isActive) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'You are already following this user',
        }),
      );
    }

    if (!followExists.isActive) {
      const updateFollow = await this.prisma.follow.update({
        where: {
          id: followExists.id,
        },
        data: {
          isActive: true,
        },
      });
      return customResponse({
        status: true,
        code: HttpStatus.CREATED,
        message: 'User followed successfully',
        data: updateFollow,
      });
    }

    try {
      const follow = await this.prisma.follow.create({
        data: {
          fromId: currentUser.id,
          toId,
        },
        include: {
          from: {
            select: {
              handle: true,
              profilePicUrl: true,
            },
          },
          to: {
            select: {
              handle: true,
              profilePicUrl: true,
            },
          },
        },
      });

      return customResponse({
        status: true,
        code: HttpStatus.CREATED,
        message: 'User followed successfully',
        data: follow,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not follow this user right now.',
          error: error.message,
        }),
      );
    }
  }

  async findAll(
    currentUser: User,
    getFollowDto: GetFollowDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    const { pagination, page, limit } = getFollowDto;

    const query = {
      fromId: currentUser.id,
      isActive: true,
    };

    try {
      const followingUsers = await this.paginate.paginator<
        Follow,
        Prisma.FollowWhereInput,
        Prisma.FollowSelect,
        Prisma.FollowInclude,
        | Prisma.FollowOrderByWithRelationInput
        | Prisma.FollowOrderByWithRelationInput[]
      >({
        paginate: { pagination, page, limit },
        model: this.prisma.follow,
        condition: {
          where: {
            ...query,
          },
        },
        includeOrSelect: {
          operator: 'include',
          value: {
            to: {
              select: {
                id: true,
                handle: true,
                profilePicUrl: true,
              },
            },
          },
        },

        orderBy: [{ createdAt: 'asc' }],
      });

      return customResponse({
        status: false,
        code: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: followingUsers,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get the following users',
          error: error.message,
        }),
      );
    }
  }

  async findOne(id: string): Promise<SuccessResponse | ErrorResponse> {
    try {
      const follow = await this.prisma.follow.findUnique({
        where: {
          id,
        },
      });

      if (!follow) {
        throw new NotFoundException(
          customResponse({
            status: false,
            code: HttpStatus.NOT_FOUND,
            message: 'Follow not found',
            error: 'Follow not found',
          }),
        );
      }

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        //message: 'User updated successfully',
        data: follow,
      });
    } catch (error) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get follow',
          error: error.message,
        }),
      );
    }
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  async unfollow(
    currentUser: User,
    userId: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    const followExists = await this.prisma.follow.findFirst({
      where: {
        toId: userId,
        fromId: currentUser.id,
        isActive: true,
      },
    });

    if (!followExists) {
      throw new NotFoundException(
        customResponse({
          status: false,
          code: HttpStatus.NOT_FOUND,
          message: 'You dont follow this user',
          error: 'You dont follow this user',
        }),
      );
    }
    try {
      const updatedFollow = await this.prisma.follow.update({
        where: {
          id: followExists.id,
        },
        data: {
          isActive: false,
        },
      });

      if (!followExists) {
        throw new NotFoundException(
          customResponse({
            status: false,
            code: HttpStatus.NOT_FOUND,
            message: 'Something went wrong.',
            error: 'Something went wrong.',
          }),
        );
      }

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'User unfollowed successfully',
        data: updatedFollow,
      });
    } catch (error) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong while unfollowing user',
          error: error.message,
        }),
      );
    }
  }

  async searchFollowedUsers(
    currentUser: User,
    getFollowDto: GetFollowDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    let allFollowingUsers: Follow[];
    const { userHandle, pagination, page, limit } = getFollowDto;
    // if (!userHandle || userHandle.length === 0) {
    //   allFollowingUsers = await this.prisma.follow.findMany({
    //     where: {
    //       fromId: currentUser.id,
    //       isActive: true,
    //     },
    //     include: {
    //       to: {
    //         select: {
    //           id: true,
    //           handle: true,
    //           profilePicUrl: true,
    //         },
    //       },
    //     },
    //   });
    //   return customResponse({
    //     status: false,
    //     code: HttpStatus.OK,
    //     message: '',
    //     data: [],
    //   });
    // }

    const query = {
      fromId: currentUser.id,
      isActive: true,
      to: {
        handle: {
          contains: userHandle,
        },
      },
    };

    try {
      const followingUsers = await this.paginate.paginator<
        Follow,
        Prisma.FollowWhereInput,
        Prisma.FollowSelect,
        Prisma.FollowInclude,
        | Prisma.FollowOrderByWithRelationInput
        | Prisma.FollowOrderByWithRelationInput[]
      >({
        paginate: { pagination, page, limit },
        model: this.prisma.follow,
        condition: {
          where: {
            //isActive,
            ...query,
          },
        },
        includeOrSelect: {
          operator: 'include',
          value: {
            to: {
              select: {
                id: true,
                handle: true,
                profilePicUrl: true,
              },
            },
          },
        },

        orderBy: [{ createdAt: 'asc' }],
      });

      return customResponse({
        status: false,
        code: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: followingUsers,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get the following users',
          error: error.message,
        }),
      );
    }
  }
}
