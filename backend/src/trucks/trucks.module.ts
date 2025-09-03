import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { Truck } from '../entities/truck.entity';
import { Driver } from '../entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck, Driver])],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
})
export class TrucksModule {}
