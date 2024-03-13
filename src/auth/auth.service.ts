import {
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, matchPasswords, signToken } from 'src/utils/functions';
import { SuccessResponse, ErrorResponse, tokenPayload } from 'types';
import { Request, Response } from 'express';
import { customResponse } from '../utils/functions';
import { LoginDto } from './dto/loginDto';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(
    createUser: CreateUserDto,
  ): Promise<SuccessResponse | ErrorResponse> {
    const { email, phoneNumber, password, firstName, lastName } = createUser;

    //check if any user has been registred with such email
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException(
        customResponse({
          status: false,
          code: HttpStatus.CONFLICT,
          message: 'This email is already taken by a user.',
          error: 'This email is already taken by a user.',
        }),
      );
    }

    //TODO : impletement npm deep-email-validator
    //https://soshace.com/verifying-an-email-address-without-sending-an-email-in-nodejs/?ref=dailydev

    try {
      const hashedPassword = await hashPassword(password);

      const randomHandler = `${firstName}${randomBytes(10).toString('hex')}`;

      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          phoneNumber,
          handle: randomHandler,
        },
      });

      // Send the response using the Express res object
      return customResponse({
        status: true,
        code: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'Something failed while creating the user.',
          error: error.message,
        }),
      );
    }
  }

  async login(loginDto: LoginDto): Promise<SuccessResponse | ErrorResponse> {
    const { email, password } = loginDto;
    console.log('ddd');

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    console.log('user', user);

    if (!user) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'No user was found with given email.',
          error: '',
        }),
      );
    }

    try {
      await matchPasswords(password, user.password);
      const payload: tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await signToken(payload);
      console.log('jher');
      return customResponse({
        status: true,
        code: HttpStatus.OK,
        message: 'User logged in successfully',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        customResponse({
          status: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something failed while logging in.',
          error: error.message,
        }),
      );
    }
  }

  async getMe(currentUser: User): Promise<SuccessResponse | ErrorResponse> {
    //console.log(currentUser);
    if (!currentUser) {
      throw new BadRequestException(
        customResponse({
          status: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'No user was found.',
          error: 'No user was found.',
        }),
      );
    }

    return customResponse({
      status: true,
      code: HttpStatus.OK,
      data: currentUser,
    });
  }
}
