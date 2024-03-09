import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const ReqUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const { user } = context.switchToHttp().getRequest();
    return user;
  },
);
