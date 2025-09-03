import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { Truck } from './truck.entity';
import { Freight } from './freight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Driver, Truck, Freight])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
