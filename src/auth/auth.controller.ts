import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { SuccessResponse, ErrorResponse } from 'types';
import { Request, Response } from 'express';
import { LoginDto } from './dto/loginDto';

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

  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
}
