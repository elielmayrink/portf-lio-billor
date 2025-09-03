export interface IDriver {
  id: string;
  name: string;
  license: string;
  status: DriverStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateDriver {
  name: string;
  license: string;
  userId: string;
}

export interface IUpdateDriver {
  name?: string;
  license?: string;
  status?: DriverStatus;
}

export interface IDriverQuery {
  limit?: number;
  offset?: number;
  order?: string;
  status?: DriverStatus;
  userId?: string;
}

export interface IDriverResponse {
  success: boolean;
  data:
    | IDriver
    | IDriver[]
    | {
        data: IDriver[];
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
  message?: string;
  timestamp: string;
}

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface IDriverFilters {
  status?: DriverStatus;
  userId?: string;
  search?: string;
}

export interface IDriverPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface IDriverSort {
  field: keyof IDriver;
  direction: 'ASC' | 'DESC';
}
