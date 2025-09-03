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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { QueryDriversDto } from './dto/query-drivers.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

// Constantes para roles
const ADMIN_ROLE: UserRole = 'admin';
const DRIVER_ROLE: UserRole = 'driver';

@ApiTags('Drivers - Motoristas')
@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(ADMIN_ROLE)
  @ApiOperation({
    summary: 'Criar novo motorista',
    description:
      'Cria um novo motorista associado a um usuário existente. Apenas administradores podem criar motoristas.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Motorista criado com sucesso',
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
            name: { type: 'string', example: 'João Silva Santos' },
            license: { type: 'string', example: '12345678901' },
            status: { type: 'string', example: 'pending' },
            userId: {
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
    description: 'Dados inválidos ou usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNH já em uso ou usuário já possui motorista',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar motoristas',
  })
  async create(@Body() createDriverDto: CreateDriverDto) {
    const driver = await this.driversService.create(createDriverDto);
    return {
      success: true,
      data: driver,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar motoristas',
    description:
      'Lista motoristas com paginação, filtros e ordenação. Apenas administradores podem listar todos os motoristas.',
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
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filtrar por ID do usuário',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por nome ou CNH',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de motoristas retornada com sucesso',
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
                  name: { type: 'string' },
                  license: { type: 'string' },
                  status: { type: 'string' },
                  userId: { type: 'string' },
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
  async findAll(@Query() queryDto: QueryDriversDto) {
    const result = await this.driversService.findAll(queryDto);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar motorista por ID',
    description: 'Retorna os dados de um motorista específico pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do motorista',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Motorista encontrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Motorista não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findOne(@Param('id') id: string) {
    const driver = await this.driversService.findOne(id);
    return {
      success: true,
      data: driver,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @Roles(ADMIN_ROLE)
  @ApiOperation({
    summary: 'Atualizar motorista',
    description:
      'Atualiza os dados de um motorista existente. Apenas administradores podem atualizar motoristas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do motorista',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Motorista atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Motorista não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'CNH já em uso por outro motorista',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar motoristas',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    const driver = await this.driversService.update(id, updateDriverDto);
    return {
      success: true,
      data: driver,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles(ADMIN_ROLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover motorista',
    description:
      'Remove um motorista do sistema. Apenas administradores podem remover motoristas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do motorista',
    example: '01cfc439-6823-4b27-bbe1-dd64d4639bf2',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Motorista removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Motorista não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover motoristas',
  })
  async remove(@Param('id') id: string) {
    await this.driversService.remove(id);
  }
}
