import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  Length,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTruckDto {
  @ApiProperty({
    description: 'Placa do caminhão (formato brasileiro)',
    example: 'ABC-1234',
    minLength: 7,
    maxLength: 8,
  })
  @IsString({ message: 'Placa deve ser uma string' })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @Length(7, 8, { message: 'Placa deve ter entre 7 e 8 caracteres' })
  @Matches(/^[A-Z]{3}-?\d{4}$/, {
    message: 'Placa deve estar no formato ABC-1234 ou ABC1234',
  })
  plate: string;

  @ApiProperty({
    description: 'Modelo do caminhão',
    example: 'Volkswagen Delivery 11.180',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Modelo deve ser uma string' })
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  @Length(3, 100, { message: 'Modelo deve ter entre 3 e 100 caracteres' })
  @Matches(/^[a-zA-Z0-9À-ÿ\s\-\.]+$/, {
    message:
      'Modelo deve conter apenas letras, números, espaços, hífens e pontos',
  })
  model: string;

  @ApiProperty({
    description: 'Ano de fabricação do caminhão',
    example: 2020,
    minimum: 1900,
    maximum: 2030,
  })
  @IsNumber({}, { message: 'Ano deve ser um número' })
  @Min(1900, { message: 'Ano deve ser maior ou igual a 1900' })
  @Max(2030, { message: 'Ano deve ser menor ou igual a 2030' })
  year: number;

  @ApiPropertyOptional({
    description: 'ID do motorista associado ao caminhão (opcional)',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do motorista deve ser um UUID válido' })
  driverId?: string;
}
