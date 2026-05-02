import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { Role } from '../common/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.authService.getProfile(userId);
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getSession(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.authService.getSession(userId);
  }

  @Get('patients/ids')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR)
  async getAllPatientIds() {
    return this.authService.getAllPatientIds();
  }

  @Get('doctors/ids')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PATIENT)
  async getAllDoctorIds() {
    return this.authService.getAllDoctorIds();
  }

  @Get('patient/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR)
  async getPatientById(@Param('id') id: string) {
    return this.authService.getPatientById(id);
  }

  @Get('doctor/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PATIENT, Role.DOCTOR)
  async getDoctorById(@Param('id') id: string) {
    return this.authService.getDoctorById(id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user as any);
    if (result.isNewUser) {
      return res.redirect(
        `http://localhost:3001/complete-profile?token=${result.accessToken}&role=${result.role}`,
      );
    }
    return res.redirect(
      `http://localhost:3001/login-success?token=${result.accessToken}`,
    );
  }

  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  async googleMobileAuth(
    @Body('idToken') idToken: string,
    @Body('platform') platform: 'android' | 'ios',
  ) {
    return this.authService.googleMobileLogin(idToken, platform);
  }

  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async completeProfile(@Req() req: Request, @Body() body: any) {
    const userId = (req.user as any).id;
    return this.authService.completeProfile(userId, body);
  }
}
