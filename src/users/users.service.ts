import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorResponse, SuccessResponse } from 'types';
import { customResponse } from 'src/utils/functions';
import { GetUsersDto } from './dto';
import { Prisma, User } from '@prisma/client';
import { PaginateService } from 'src/paginate/paginate.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private paginate: PaginateService,
  ) {}

  async findAll(getusers: GetUsersDto) {
    try {
      //console.log(getCategories);
      const { pagination, page, limit, firstName, lastName, handle } = getusers;

      const query = {
        handle,
        lastName,
        firstName,
      };

      const users = await this.paginate.paginator<
        User,
        Prisma.UserWhereInput,
        Prisma.UserSelect,
        Prisma.UserInclude,
        | Prisma.UserOrderByWithRelationInput
        | Prisma.UserOrderByWithRelationInput[]
      >({
        paginate: { pagination, page, limit },
        model: this.prisma.user,
        condition: {
          where: {
            //isActive,
            ...query,
          },
        },
        orderBy: [{ createdAt: 'asc' }],
      });

      // const categories = await this.prisma.category.findMany({
      //   select: { id: true, name: true },
      // });

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: users,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get users',
          error: error.message,
        }),
      );
    }
  }

  async findOne(id: string): Promise<SuccessResponse | ErrorResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException(
          customResponse({
            status: false,
            code: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: 'User not found',
          }),
        );
      }

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        //message: 'User updated successfully',
        data: {},
      });
    } catch (error) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not update user',
          error: error.message,
        }),
      );
    }
  }

  async update(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...updateUserDto,
        },
      });

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'User updated successfully',
        data: updateUser,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not update user',
          error: error.message,
        }),
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
