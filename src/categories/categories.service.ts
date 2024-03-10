import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { customResponse } from 'src/utils/functions';
import { GetCategoriesDto } from './dto';
import { Category, Prisma } from '@prisma/client';
import { PaginateService } from 'src/paginate/paginate.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private paginate: PaginateService,
  ) {}

  async findAll(getCategories: GetCategoriesDto) {
    try {
      //console.log(getCategories);
      const { pagination, page, limit, name } = getCategories;

      const query = {
        //isActive: true,
        name,
      };

      const categories = await this.paginate.paginator<
        Category,
        Prisma.CategoryWhereInput,
        Prisma.CategorySelect,
        Prisma.CategoryInclude,
        | Prisma.CategoryOrderByWithRelationInput
        | Prisma.CategoryOrderByWithRelationInput[]
      >({
        paginate: { pagination, page, limit },
        model: this.prisma.category,
        condition: {
          where: {
            //isActive,
            ...query,
          },
        },
        includeOrSelect: {
          operator: 'select',
          value: {
            id: true,
            name: true,
          },
        },
        // select: {
        //   id: true,
        //   name: true,
        // },
        // orderBy: [{ createdAt: 'asc' }],
      });

      // const categories = await this.prisma.category.findMany({
      //   select: { id: true, name: true },
      // });

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'Categories fetched successfully',
        data: categories,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get categories',
          error: error.message,
        }),
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        select: { name: true, id: true },
      });

      if (!category) {
        throw new NotFoundException({
          status: false,
          code: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          error: 'Category not found',
        });
      }

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get category',
          error: error.message,
        }),
      );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name } = updateCategoryDto;
      const category = await this.prisma.category.update({
        where: { id },
        data: { name },
      });

      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not get category',
          error: error.message,
        }),
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
