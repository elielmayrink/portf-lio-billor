import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'Role do usuário',
    enum: UserRole,
    default: UserRole.DRIVER,
    example: UserRole.DRIVER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser admin ou driver' })
  role?: UserRole = UserRole.DRIVER;
}
