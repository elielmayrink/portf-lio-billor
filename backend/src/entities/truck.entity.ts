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

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_trucks_plate', { unique: true })
  @Column({ type: 'varchar', length: 16 })
  plate: string;

  @Column({ type: 'varchar', length: 120 })
  model: string;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @ManyToOne(() => Driver, { nullable: true })
  driver?: Driver | null;

  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
