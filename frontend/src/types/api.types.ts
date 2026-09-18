export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error: {
    statusCode?: number;
    explanation?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalRecords: number;
}
