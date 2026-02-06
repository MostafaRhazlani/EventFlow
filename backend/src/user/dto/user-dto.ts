import { Roles } from 'src/user/enums/roles.enum';

export class UserDto {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
}
