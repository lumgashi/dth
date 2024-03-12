import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginateService } from 'src/paginate/paginate.service';
import { SuccessResponse, ErrorResponse } from 'types';
import { customResponse } from 'src/utils/functions';
import { GetAcitivitiesDto } from './dto/get-activities.dto';
import { Activity, Prisma } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private paginate: PaginateService,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      const { userId, postId, actionType } = createActivityDto;
      const action = await this.prisma.activity.create({
        data: {
          userId,
          postId,
          actionType,
        },
      });

      return customResponse({
        status: true,
        code: HttpStatus.CREATED,
        message: 'Activity created successfully',
        data: action,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not create activity',
          error: error.message,
        }),
      );
    }
  }

  async findAll(getActivities: GetAcitivitiesDto) {
    const { pagination, page, limit, actionType } = getActivities;
    const query = {
      actionType,
      // isActive: true,
    };

    const activities = await this.paginate.paginator<
      Activity,
      Prisma.ActivityWhereInput,
      Prisma.ActivitySelect,
      Prisma.ActivityInclude,
      | Prisma.ActivityOrderByWithRelationInput
      | Prisma.ActivityOrderByWithRelationInput[]
    >({
      paginate: { pagination, page, limit },
      model: this.prisma.activity,
      condition: {
        where: {
          isActive: true,
          ...query,
        },
      },
      includeOrSelect: {
        operator: 'select',
        value: {
          id: true,
          actionType: true,
          user: true,
          post: true,
        },
      },
      // select: {
      //   id: true,
      //   name: true,
      // },
      // orderBy: [{ createdAt: 'asc' }],
    });

    return customResponse({
      status: true,
      code: HttpStatus.OK,
      message: 'Activities fetched successfully',
      data: activities,
    });
    try {
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get activities',
          error: error.message,
        }),
      );
    }
  }

  findOne(id: string) {
    const activity = this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException(
        customResponse({
          status: false,
          code: HttpStatus.NOT_FOUND,
          message: 'Activity not found',
          error: 'Activity not found',
        }),
      );
    }

    return customResponse({
      status: true,
      code: HttpStatus.OK,
      message: 'Activity fetched successfully',
      data: activity,
    });
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      const { isActive } = updateActivityDto;
      const updateActivity = await this.prisma.activity.update({
        where: { id },
        data: { isActive },
      });
      return customResponse({
        status: true,
        code: HttpStatus.NO_CONTENT,
        message: 'Activity updated successfully',
        data: {},
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not update activity',
          error: error.message,
        }),
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
