import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Length } from 'class-validator';

export class QueryTrucksDto {
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
    description: 'Filtrar por ID do motorista',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @IsOptional()
  @IsUUID('4', { message: 'DriverId deve ser um UUID válido' })
  driverId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ano de fabricação',
    example: 2020,
    minimum: 1900,
    maximum: 2030,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Year deve ser um número' })
  @Min(1900, { message: 'Year deve ser maior ou igual a 1900' })
  @Max(2030, { message: 'Year deve ser menor ou igual a 2030' })
  year?: number;

  @ApiPropertyOptional({
    description: 'Busca por placa ou modelo',
    example: 'ABC-1234',
  })
  @IsOptional()
  @IsString({ message: 'Search deve ser uma string' })
  @Length(2, 50, { message: 'Search deve ter entre 2 e 50 caracteres' })
  search?: string;
}
