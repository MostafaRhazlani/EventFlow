import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/user/dto/user-dto';
import { Roles } from 'src/user/enums/roles.enum';

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

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    user: UserDto;
  }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProps } = user.toObject() as UserDto;

    const payload = {
      sub: userProps._id.toString(),
      email: user.email,
      full_name: `${user.first_name} ${user.last_name}`,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        ...userProps,
        _id: userProps._id.toString(),
      } as UserDto,
    };
  }

  async getMe(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProps } = user.toObject() as UserDto;
    return {
      ...userProps,
      _id: userProps._id.toString(),
    } as UserDto;
  }

  async becomeOrganizer(userId: string) {
    const existingUser = await this.userService.findOne(userId);
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }
    const user = await this.userService.update(userId, {
      role: Roles.ORGANIZER,
      isApproved: false,
    });
    return user;
  }
}
