import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateExpenseLimitDto } from './dto/update-expense-limit.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        monthlyExpenseLimit: req.user.monthlyExpenseLimit,
        currency: req.user.currency,
        limitEnabled: req.user.limitEnabled,
      },
    };
  }

  @Put('profile/expense-limit')
  @UseGuards(JwtAuthGuard)
  async updateExpenseLimit(
    @Body() updateExpenseLimitDto: UpdateExpenseLimitDto,
    @Request() req: any,
  ) {
    return this.authService.updateExpenseLimit(
      req.user._id,
      updateExpenseLimitDto,
    );
  }
}
