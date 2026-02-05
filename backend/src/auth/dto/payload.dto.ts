import { Roles } from 'src/user/enums/roles.enum';

export class Payload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
}
