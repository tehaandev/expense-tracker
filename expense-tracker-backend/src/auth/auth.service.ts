import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/hashPassword';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateExpenseLimitDto } from './dto/update-expense-limit.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await this.usersService.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async validateUser(id: string) {
    return this.usersService.findById(id);
  }

  async updateExpenseLimit(userId: string, updateDto: UpdateExpenseLimitDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update user's expense limit settings
    if (updateDto.monthlyExpenseLimit !== undefined) {
      user.monthlyExpenseLimit = updateDto.monthlyExpenseLimit;
    }
    if (updateDto.currency !== undefined) {
      user.currency = updateDto.currency;
    }
    if (updateDto.limitEnabled !== undefined) {
      user.limitEnabled = updateDto.limitEnabled;
    }

    await user.save();

    return {
      message: 'Expense limit updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyExpenseLimit: user.monthlyExpenseLimit,
        currency: user.currency,
        limitEnabled: user.limitEnabled,
      },
    };
  }
}
