import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { QueryTrucksDto } from './dto/query-trucks.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Constantes para roles
const ADMIN_ROLE = 'admin';
const DRIVER_ROLE = 'driver';

@ApiTags('Trucks - Caminhões')
@Controller('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @Roles(ADMIN_ROLE)
  @ApiOperation({
    summary: 'Criar novo caminhão',
    description:
      'Cria um novo caminhão. Apenas administradores podem criar caminhões.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Caminhão criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
            },
            plate: { type: 'string', example: 'ABC-1234' },
            model: { type: 'string', example: 'Volkswagen Delivery 11.180' },
            year: { type: 'number', example: 2020 },
            driverId: {
              type: 'string',
              example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou motorista não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Placa já em uso ou motorista já associado a outro caminhão',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar caminhões',
  })
  async create(@Body() createTruckDto: CreateTruckDto) {
    const truck = await this.trucksService.create(createTruckDto);
    return {
      success: true,
      data: truck,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar caminhões',
    description:
      'Lista caminhões com paginação, filtros e ordenação. Apenas administradores podem listar todos os caminhões.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados por página (1-100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginação',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Ordenação (ex: createdAt:DESC)',
  })
  @ApiQuery({
    name: 'driverId',
    required: false,
    type: String,
    description: 'Filtrar por ID do motorista',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filtrar por ano de fabricação',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por placa ou modelo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de caminhões retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  plate: { type: 'string' },
                  model: { type: 'string' },
                  year: { type: 'number' },
                  driverId: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                limit: { type: 'number' },
                offset: { type: 'number' },
                total: { type: 'number' },
                hasMore: { type: 'boolean' },
              },
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findAll(@Query() queryDto: QueryTrucksDto) {
    const result = await this.trucksService.findAll(queryDto);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar caminhão por ID',
    description: 'Retorna os dados de um caminhão específico pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do caminhão',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Caminhão encontrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Caminhão não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findOne(@Param('id') id: string) {
    const truck = await this.trucksService.findOne(id);
    return {
      success: true,
      data: truck,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @Roles(ADMIN_ROLE)
  @ApiOperation({
    summary: 'Atualizar caminhão',
    description:
      'Atualiza os dados de um caminhão existente. Apenas administradores podem atualizar caminhões.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do caminhão',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Caminhão atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Caminhão não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Placa já em uso por outro caminhão',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar caminhões',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    const truck = await this.trucksService.update(id, updateTruckDto);
    return {
      success: true,
      data: truck,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles(ADMIN_ROLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover caminhão',
    description:
      'Remove um caminhão do sistema. Apenas administradores podem remover caminhões.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do caminhão',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Caminhão removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Caminhão não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover caminhões',
  })
  async remove(@Param('id') id: string) {
    await this.trucksService.remove(id);
  }
}
