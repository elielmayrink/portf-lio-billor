import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dataSource from './typeorm.config';
import { User, UserRole } from './entities/user.entity';
import { Driver } from './entities/driver.entity';
import { Truck } from './entities/truck.entity';
import { DriverStatus } from './drivers/types/driver.types';
import * as bcrypt from 'bcrypt';

interface CreateUserData {
  email: string;
  passwordHash: string;
  role: UserRole;
}

async function run() {
  const ds: DataSource = await dataSource.initialize();
  const repo = ds.getRepository(User);

  const existing = await repo.findOne({ where: { email: 'admin@demo.local' } });
  let adminUser: User | null = null;
  if (!existing) {
    const passwordHash: string = await bcrypt.hash('admin123', 10);
    const adminUserData: CreateUserData = {
      email: 'admin@demo.local',
      passwordHash,
      role: 'admin',
    };
    adminUser = await repo.save(adminUserData);
  } else {
    adminUser = existing;
  }

  const driverUser = await repo.findOne({
    where: { email: 'driver@demo.local' },
  });
  let driverUserData: User | null = null;
  if (!driverUser) {
    const passwordHash: string = await bcrypt.hash('driver123', 10);
    const driverUserDataCreate: CreateUserData = {
      email: 'driver@demo.local',
      passwordHash,
      role: 'driver',
    };
    driverUserData = await repo.save(driverUserDataCreate);
  } else {
    driverUserData = driverUser;
  }

  // Create sample drivers
  const driverRepo = ds.getRepository(Driver);

  // Create driver for admin user
  const adminDriver = await driverRepo.findOne({
    where: { userId: adminUser.id },
  });
  if (!adminDriver) {
    const adminDriverData = {
      name: 'Administrador Sistema',
      license: '12345678901',
      status: DriverStatus.ACTIVE,
      userId: adminUser.id,
    };
    await driverRepo.save(adminDriverData);
  }

  // Create driver for driver user
  const driverDriver = await driverRepo.findOne({
    where: { userId: driverUserData.id },
  });
  if (!driverDriver) {
    const driverDriverData = {
      name: 'João Silva Santos',
      license: '98765432109',
      status: DriverStatus.ACTIVE,
      userId: driverUserData.id,
    };
    await driverRepo.save(driverDriverData);
  }

  // Create sample trucks
  const truckRepo = ds.getRepository(Truck);

  // Create truck for admin driver
  if (adminDriver) {
    const adminTruck = await truckRepo.findOne({
      where: { driverId: adminDriver.id },
    });
    if (!adminTruck) {
      const adminTruckData = {
        plate: 'ADM-1234',
        model: 'Volkswagen Delivery 11.180',
        year: 2020,
        driverId: adminDriver.id,
      };
      await truckRepo.save(adminTruckData);
    }
  }

  // Create truck for driver user
  if (driverDriver) {
    const driverTruck = await truckRepo.findOne({
      where: { driverId: driverDriver.id },
    });
    if (!driverTruck) {
      const driverTruckData = {
        plate: 'JOA-5678',
        model: 'Mercedes-Benz Atego 1318',
        year: 2019,
        driverId: driverDriver.id,
      };
      await truckRepo.save(driverTruckData);
    }
  }

  await ds.destroy();

  console.log('Seed completed');
}

void run().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
