import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { SuccessResponse, ErrorResponse, UserRole } from 'types';
import { Request, Response } from 'express';
import { LoginDto } from './dto/loginDto';
import { ReqUser, Roles } from './decorators';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description Register new user
   * @route       POST /api/auth/register'.
   * @access      Public
   */
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.authService.register(createUser);
  }

  /**
   * @description Login user
   * @route       POST /api/auth/login'.
   * @access      Public
   */
  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  /**
   * @description Get currect logedin user
   * @route       POST /api/auth/get-me'.
   * @access      Private [User]
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('get-me')
  async getMe(@ReqUser() currentUser: User) {
    return this.authService.getMe(currentUser);
  }
}
