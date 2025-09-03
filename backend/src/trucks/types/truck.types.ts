export interface ITruck {
  id: string;
  plate: string;
  model: string;
  year: number | null;
  driverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTruck {
  plate: string;
  model: string;
  year: number;
  driverId?: string;
}

export interface IUpdateTruck {
  plate?: string;
  model?: string;
  year?: number;
  driverId?: string;
}

export interface ITruckQuery {
  limit?: number;
  offset?: number;
  order?: string;
  driverId?: string;
  year?: number;
}

export interface ITruckResponse {
  success: boolean;
  data:
    | ITruck
    | ITruck[]
    | {
        data: ITruck[];
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
  message?: string;
  timestamp: string;
}

export interface ITruckFilters {
  driverId?: string;
  year?: number;
  search?: string;
}

export interface ITruckPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ITruckSort {
  field: keyof ITruck;
  direction: 'ASC' | 'DESC';
}
