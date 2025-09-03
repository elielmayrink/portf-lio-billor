import {
  IsString,
  IsNotEmpty,
  IsUUID,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({
    description: 'Nome completo do motorista',
    example: 'João Silva Santos',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Nome deve conter apenas letras e espaços',
  })
  name: string;

  @ApiProperty({
    description: 'Número da CNH do motorista',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsString({ message: 'CNH deve ser uma string' })
  @IsNotEmpty({ message: 'CNH é obrigatória' })
  @Length(11, 11, { message: 'CNH deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, {
    message: 'CNH deve conter apenas números',
  })
  license: string;

  @ApiProperty({
    description: 'ID do usuário associado ao motorista',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @IsUUID('4', { message: 'ID do usuário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  userId: string;
}
