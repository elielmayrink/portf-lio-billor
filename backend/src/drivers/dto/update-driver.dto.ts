import {
  IsString,
  IsOptional,
  IsUUID,
  Length,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DriverStatus } from '../types/driver.types';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    description: 'Nome completo do motorista',
    example: 'João Silva Santos',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Nome deve conter apenas letras e espaços',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Número da CNH do motorista',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsOptional()
  @IsString({ message: 'CNH deve ser uma string' })
  @Length(11, 11, { message: 'CNH deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, {
    message: 'CNH deve conter apenas números',
  })
  license?: string;

  @ApiPropertyOptional({
    description: 'Status do motorista',
    enum: DriverStatus,
    example: DriverStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(DriverStatus, { message: 'Status deve ser um valor válido' })
  status?: DriverStatus;
}
