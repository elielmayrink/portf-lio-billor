import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from './create-user.dto';

export class QueryUsersDto {
  @ApiPropertyOptional({
    description: 'Número de itens por página',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit deve ser um número' })
  @Min(1, { message: 'Limit deve ser pelo menos 1' })
  @Max(100, { message: 'Limit deve ser no máximo 100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Número de itens para pular',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Offset deve ser um número' })
  @Min(0, { message: 'Offset deve ser pelo menos 0' })
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Filtrar por email',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString({ message: 'Email deve ser uma string' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por role',
    enum: UserRole,
    example: UserRole.DRIVER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser admin ou driver' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Ordenar por campo (formato: campo:asc|desc)',
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString({ message: 'Order deve ser uma string' })
  order?: string;
}
