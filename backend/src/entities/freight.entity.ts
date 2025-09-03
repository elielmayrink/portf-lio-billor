import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Truck } from './truck.entity';

export type FreightStatus =
  | 'created'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

@Entity('freights')
@Index('idx_freights_status_driver', ['status', 'driver'])
export class Freight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver, { nullable: false, eager: true })
  driver: Driver;

  @ManyToOne(() => Truck, { nullable: false, eager: true })
  truck: Truck;

  @Column({ type: 'varchar', length: 120 })
  origin: string;

  @Column({ type: 'varchar', length: 120 })
  destination: string;

  @Column({ type: 'varchar', length: 24, default: 'created' })
  status: FreightStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
