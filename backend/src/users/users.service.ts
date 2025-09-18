import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, password: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.getPrisma().user.create({
      data: { email, password: hash },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.getPrisma().user.findUnique({ where: { email } });
  }
}
