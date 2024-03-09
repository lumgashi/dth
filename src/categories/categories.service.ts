import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { customResponse } from 'src/utils/functions';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({});

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
      const category = await this.prisma.category.findUnique({ where: { id } });

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
