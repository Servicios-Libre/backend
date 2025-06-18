import { Role } from 'src/modules/users/entities/roles.enum';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }
  }
}
