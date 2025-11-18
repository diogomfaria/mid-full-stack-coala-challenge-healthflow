import { User } from './user.entity';
import { UserRole } from './user-role.enum';

export type CreateUserProps = {
  email: string;
  password: string;
  role: UserRole;
};

export interface UserRepository {
  create(data: CreateUserProps): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');