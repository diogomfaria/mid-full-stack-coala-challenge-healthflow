import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateUserProps, UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.enum';
import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(user: PrismaUser): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(data: CreateUserProps): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role as PrismaUserRole,
      },
    });

    return this.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }
}