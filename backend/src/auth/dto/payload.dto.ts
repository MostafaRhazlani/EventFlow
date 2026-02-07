import { Roles } from 'src/user/enums/roles.enum';

export class Payload {
  sub: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
}
