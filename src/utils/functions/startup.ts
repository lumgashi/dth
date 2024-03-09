import { categories } from './seedData';
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

export const initCategories = async () => {
  for (const categoryName of categories as string[]) {
    const categoryExists = await prisma.category.count({
      where: { name: categoryName },
    });

    if (categoryExists > 0) continue;
    await prisma.category.create({ data: { name: categoryName } });
  }
  return;
};
