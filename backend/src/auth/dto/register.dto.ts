import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/user/enums/roles.enum';

export class RegisterDto {
  @IsString({ message: 'First name is required' })
  first_name: string;

  @IsString({ message: 'Last name is required' })
  last_name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters' })
  password: string;

  @IsOptional()
  @IsEnum(Roles, { message: 'Role is invalid' })
  role?: Roles;
}
