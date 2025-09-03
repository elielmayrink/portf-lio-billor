import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email is already in use
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    // Create user
    const user = this.usersRepo.create({
      email: createUserDto.email,
      passwordHash: hashedPassword,
      role: createUserDto.role || UserRole.DRIVER,
    });

    try {
      const savedUser = await this.usersRepo.save(user);
      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = savedUser;
      return result as User;
    } catch {
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async findAll(query: QueryUsersDto) {
    const { limit = 20, offset = 0, email, role, order } = query;

    // Build where clause
    const where: FindOptionsWhere<User> = {};
    if (email) {
      where.email = Like(`%${email}%`);
    }
    if (role) {
      where.role = role;
    }

    // Build order clause
    let orderClause = {};
    if (order) {
      const [field, direction] = order.split(':');
      const validFields = ['id', 'email', 'role', 'createdAt', 'updatedAt'];
      const validDirections = ['ASC', 'DESC'];

      if (
        validFields.includes(field) &&
        validDirections.includes(direction?.toUpperCase())
      ) {
        orderClause = { [field]: direction.toUpperCase() };
      }
    }

    // Default order
    if (Object.keys(orderClause).length === 0) {
      orderClause = { createdAt: 'DESC' };
    }

    try {
      const [users, total] = await this.usersRepo.findAndCount({
        where,
        order: orderClause,
        skip: offset,
        take: limit,
        select: ['id', 'email', 'role', 'createdAt', 'updatedAt'], // Exclude password
      });

      return {
        data: users,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    } catch {
      throw new BadRequestException('Erro ao buscar usuários');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepo.findOne({
        where: { id },
        select: ['id', 'email', 'role', 'createdAt', 'updatedAt'], // Exclude password
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar usuário');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Check if email is being changed and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailInUse = await this.findByEmail(updateUserDto.email);
      if (emailInUse) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Hash new password if provided
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      await this.usersRepo.update(id, {
        ...updateUserDto,
        ...(hashedPassword && { passwordHash: hashedPassword }),
        updatedAt: new Date(),
      });

      return this.findOne(id);
    } catch {
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    await this.findOne(id);

    try {
      await this.usersRepo.delete(id);
    } catch {
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }
}
