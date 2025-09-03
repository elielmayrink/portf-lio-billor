import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { DriverStatus } from '../types/driver.types';
import { Length } from 'class-validator';

export class QueryDriversDto {
  @ApiPropertyOptional({
    description: 'Limite de resultados por página',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit deve ser um número' })
  @Min(1, { message: 'Limit deve ser pelo menos 1' })
  @Max(100, { message: 'Limit não pode ser maior que 100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Offset para paginação',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Offset deve ser um número' })
  @Min(0, { message: 'Offset não pode ser negativo' })
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Campo para ordenação (formato: campo:ASC|DESC)',
    example: 'createdAt:DESC',
    pattern: '^[a-zA-Z]+:(ASC|DESC)$',
  })
  @IsOptional()
  @IsString({ message: 'Order deve ser uma string' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [field, direction] = value.split(':');
      if (field && ['ASC', 'DESC'].includes(direction?.toUpperCase())) {
        return `${field}:${direction.toUpperCase()}`;
      }
    }
    return 'createdAt:DESC';
  })
  order?: string = 'createdAt:DESC';

  @ApiPropertyOptional({
    description: 'Filtrar por status do motorista',
    enum: DriverStatus,
    example: DriverStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(DriverStatus, { message: 'Status deve ser um valor válido' })
  status?: DriverStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do usuário',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @IsOptional()
  @IsUUID('4', { message: 'UserId deve ser um UUID válido' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Busca por nome ou CNH',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString({ message: 'Search deve ser uma string' })
  @Length(2, 50, { message: 'Search deve ter entre 2 e 50 caracteres' })
  search?: string;
}
