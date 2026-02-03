import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('This email is already exist');
    }

    const user = await this.userService.create(dto);
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      full_name: `${user.first_name} ${user.last_name}`,
      role: user.role,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
