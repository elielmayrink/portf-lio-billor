import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../entities/truck.entity';
import { Driver } from '../entities/driver.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { QueryTrucksDto } from './dto/query-trucks.dto';
import {
  ITruck,
  ICreateTruck,
  IUpdateTruck,
  ITruckQuery,
  ITruckPagination,
} from './types/truck.types';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createTruckDto: CreateTruckDto): Promise<ITruck> {
    try {
      // Verificar se a placa já está em uso
      const existingPlate = await this.truckRepository.findOne({
        where: { plate: createTruckDto.plate },
      });

      if (existingPlate) {
        throw new ConflictException(
          `Placa ${createTruckDto.plate} já está em uso`,
        );
      }

      // Verificar se o driver existe (se fornecido)
      if (createTruckDto.driverId) {
        const driver = await this.driverRepository.findOne({
          where: { id: createTruckDto.driverId },
        });

        if (!driver) {
          throw new NotFoundException(
            `Motorista com ID ${createTruckDto.driverId} não encontrado`,
          );
        }

        // Verificar se o driver já está associado a outro truck
        const existingDriverTruck = await this.truckRepository.findOne({
          where: { driverId: createTruckDto.driverId },
        });

        if (existingDriverTruck) {
          throw new ConflictException(
            `Motorista ${createTruckDto.driverId} já está associado a outro caminhão`,
          );
        }
      }

      // Criar o truck
      const truck = this.truckRepository.create(createTruckDto);
      const savedTruck = await this.truckRepository.save(truck);

      return this.mapToTruckInterface(savedTruck);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar caminhão');
    }
  }

  async findAll(
    queryDto: QueryTrucksDto,
  ): Promise<{ data: ITruck[]; pagination: ITruckPagination }> {
    try {
      const {
        limit = 20,
        offset = 0,
        order = 'createdAt:DESC',
        driverId,
        year,
        search,
      } = queryDto;

      // Construir query base
      const queryBuilder = this.truckRepository
        .createQueryBuilder('truck')
        .leftJoinAndSelect('truck.driver', 'driver')
        .select([
          'truck.id',
          'truck.plate',
          'truck.model',
          'truck.year',
          'truck.driverId',
          'truck.createdAt',
          'truck.updatedAt',
          'driver.name',
        ]);

      // Aplicar filtros
      if (driverId) {
        queryBuilder.andWhere('truck.driverId = :driverId', { driverId });
      }

      if (year) {
        queryBuilder.andWhere('truck.year = :year', { year });
      }

      if (search) {
        queryBuilder.andWhere(
          '(truck.plate ILIKE :search OR truck.model ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Aplicar ordenação
      const [field, direction] = order.split(':');
      if (field && ['ASC', 'DESC'].includes(direction)) {
        queryBuilder.orderBy(`truck.${field}`, direction as 'ASC' | 'DESC');
      }

      // Aplicar paginação
      queryBuilder.limit(limit).offset(offset);

      // Executar query
      const [trucks, total] = await queryBuilder.getManyAndCount();

      // Calcular paginação
      const hasMore = offset + limit < total;

      return {
        data: trucks.map((truck) => this.mapToTruckInterface(truck)),
        pagination: {
          limit,
          offset,
          total,
          hasMore,
        },
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar caminhões');
    }
  }

  async findOne(id: string): Promise<ITruck> {
    try {
      const truck = await this.truckRepository.findOne({
        where: { id },
        relations: ['driver'],
      });

      if (!truck) {
        throw new NotFoundException(`Caminhão com ID ${id} não encontrado`);
      }

      return this.mapToTruckInterface(truck);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar caminhão');
    }
  }

  async update(id: string, updateTruckDto: UpdateTruckDto): Promise<ITruck> {
    try {
      const truck = await this.truckRepository.findOne({
        where: { id },
      });

      if (!truck) {
        throw new NotFoundException(`Caminhão com ID ${id} não encontrado`);
      }

      // Verificar se a placa já está em uso por outro truck
      if (updateTruckDto.plate && updateTruckDto.plate !== truck.plate) {
        const existingPlate = await this.truckRepository.findOne({
          where: { plate: updateTruckDto.plate },
        });

        if (existingPlate) {
          throw new ConflictException(
            `Placa ${updateTruckDto.plate} já está em uso`,
          );
        }
      }

      // Verificar se o driver existe (se fornecido)
      if (updateTruckDto.driverId) {
        const driver = await this.driverRepository.findOne({
          where: { id: updateTruckDto.driverId },
        });

        if (!driver) {
          throw new NotFoundException(
            `Motorista com ID ${updateTruckDto.driverId} não encontrado`,
          );
        }

        // Verificar se o driver já está associado a outro truck
        const existingDriverTruck = await this.truckRepository.findOne({
          where: { driverId: updateTruckDto.driverId },
        });

        if (existingDriverTruck && existingDriverTruck.id !== id) {
          throw new ConflictException(
            `Motorista ${updateTruckDto.driverId} já está associado a outro caminhão`,
          );
        }
      }

      // Atualizar o truck
      Object.assign(truck, updateTruckDto);
      const updatedTruck = await this.truckRepository.save(truck);

      return this.mapToTruckInterface(updatedTruck);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar caminhão');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const truck = await this.truckRepository.findOne({
        where: { id },
      });

      if (!truck) {
        throw new NotFoundException(`Caminhão com ID ${id} não encontrado`);
      }

      // Verificar se o truck está associado a algum frete ativo
      // TODO: Implementar verificação de fretes quando o módulo estiver pronto

      await this.truckRepository.remove(truck);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover caminhão');
    }
  }

  async findByDriverId(driverId: string): Promise<ITruck | null> {
    try {
      const truck = await this.truckRepository.findOne({
        where: { driverId },
      });

      return truck ? this.mapToTruckInterface(truck) : null;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar caminhão por motorista');
    }
  }

  private mapToTruckInterface(truck: Truck): ITruck {
    return {
      id: truck.id,
      plate: truck.plate,
      model: truck.model,
      year: truck.year,
      driverId: truck.driverId,
      createdAt: truck.createdAt,
      updatedAt: truck.updatedAt,
    };
  }
}
