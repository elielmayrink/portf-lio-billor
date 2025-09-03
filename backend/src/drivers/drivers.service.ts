import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { User } from '../entities/user.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { QueryDriversDto } from './dto/query-drivers.dto';
import {
  IDriver,
  ICreateDriver,
  IUpdateDriver,
  IDriverQuery,
  IDriverPagination,
  DriverStatus,
} from './types/driver.types';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<IDriver> {
    try {
      // Verificar se o usuário existe
      const user = await this.userRepository.findOne({
        where: { id: createDriverDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `Usuário com ID ${createDriverDto.userId} não encontrado`,
        );
      }

      // Verificar se já existe um driver para este usuário
      const existingDriver = await this.driverRepository.findOne({
        where: { userId: createDriverDto.userId },
      });

      if (existingDriver) {
        throw new ConflictException(
          `Já existe um motorista cadastrado para o usuário ${createDriverDto.userId}`,
        );
      }

      // Verificar se a CNH já está em uso
      const existingLicense = await this.driverRepository.findOne({
        where: { license: createDriverDto.license },
      });

      if (existingLicense) {
        throw new ConflictException(
          `CNH ${createDriverDto.license} já está em uso`,
        );
      }

      // Criar o driver
      const driver = this.driverRepository.create({
        ...createDriverDto,
        status: DriverStatus.PENDING,
      });

      const savedDriver = await this.driverRepository.save(driver);
      return this.mapToDriverInterface(savedDriver);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar motorista');
    }
  }

  async findAll(
    queryDto: QueryDriversDto,
  ): Promise<{ data: IDriver[]; pagination: IDriverPagination }> {
    try {
      const {
        limit = 20,
        offset = 0,
        order = 'createdAt:DESC',
        status,
        userId,
        search,
      } = queryDto;

      // Construir query base
      const queryBuilder = this.driverRepository
        .createQueryBuilder('driver')
        .leftJoinAndSelect('driver.user', 'user')
        .select([
          'driver.id',
          'driver.name',
          'driver.license',
          'driver.status',
          'driver.userId',
          'driver.createdAt',
          'driver.updatedAt',
          'user.email',
        ]);

      // Aplicar filtros
      if (status) {
        queryBuilder.andWhere('driver.status = :status', { status });
      }

      if (userId) {
        queryBuilder.andWhere('driver.userId = :userId', { userId });
      }

      if (search) {
        queryBuilder.andWhere(
          '(driver.name ILIKE :search OR driver.license ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Aplicar ordenação
      const [field, direction] = order.split(':');
      if (field && ['ASC', 'DESC'].includes(direction)) {
        queryBuilder.orderBy(`driver.${field}`, direction as 'ASC' | 'DESC');
      }

      // Aplicar paginação
      queryBuilder.limit(limit).offset(offset);

      // Executar query
      const [drivers, total] = await queryBuilder.getManyAndCount();

      // Calcular paginação
      const hasMore = offset + limit < total;

      return {
        data: drivers.map((driver) => this.mapToDriverInterface(driver)),
        pagination: {
          limit,
          offset,
          total,
          hasMore,
        },
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar motoristas');
    }
  }

  async findOne(id: string): Promise<IDriver> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!driver) {
        throw new NotFoundException(`Motorista com ID ${id} não encontrado`);
      }

      return this.mapToDriverInterface(driver);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar motorista');
    }
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<IDriver> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { id },
      });

      if (!driver) {
        throw new NotFoundException(`Motorista com ID ${id} não encontrado`);
      }

      // Verificar se a CNH já está em uso por outro driver
      if (
        updateDriverDto.license &&
        updateDriverDto.license !== driver.license
      ) {
        const existingLicense = await this.driverRepository.findOne({
          where: { license: updateDriverDto.license },
        });

        if (existingLicense) {
          throw new ConflictException(
            `CNH ${updateDriverDto.license} já está em uso`,
          );
        }
      }

      // Atualizar o driver
      Object.assign(driver, updateDriverDto);
      const updatedDriver = await this.driverRepository.save(driver);

      return this.mapToDriverInterface(updatedDriver);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar motorista');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { id },
      });

      if (!driver) {
        throw new NotFoundException(`Motorista com ID ${id} não encontrado`);
      }

      // Verificar se o driver está associado a algum frete ativo
      // TODO: Implementar verificação de fretes quando o módulo estiver pronto

      await this.driverRepository.remove(driver);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover motorista');
    }
  }

  async findByUserId(userId: string): Promise<IDriver | null> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { userId },
      });

      return driver ? this.mapToDriverInterface(driver) : null;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar motorista por usuário');
    }
  }

  private mapToDriverInterface(driver: Driver): IDriver {
    return {
      id: driver.id,
      name: driver.name,
      license: driver.license,
      status: driver.status,
      userId: driver.userId,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
