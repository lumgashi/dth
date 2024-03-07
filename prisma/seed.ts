// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  // const post1 = await prisma.post.create({
  //   data: {
  //     title: 'Prisma Adds Support for MongoDB',
  //     slug: 'Prisma Adds Support for MongoDB',
  //     body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
  //   },
  // });
  // console.log({ post1 });
  // const newuser = await prisma.user.create({
  //   data: {
  //     firstName: 'Johannes',
  //     lastName: 'Meister',
  //     email: 'johannes1@me.com',
  //     phoneNumber: '353443',
  //     password: '121212121',
  //   },
  // });
  //await prisma.user.deleteMany({});
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
