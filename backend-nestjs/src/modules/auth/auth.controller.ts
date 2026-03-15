import { Controller, Post, Body, Get, Param, Patch, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.authService.getUserProfile(userId);
  }

  @Patch('profile/:userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<RegisterDto>,
  ) {
    return this.authService.updateUserProfile(userId, updateData);
  }
}
