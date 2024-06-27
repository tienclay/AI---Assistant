export interface CorePaginateResult {
  status?: boolean;
  statusCode: number;
  data?: {
    list?: any;
    total?: number;
    pages?: number;
    hasNextPage?: boolean;
    encKey?: string;
  } | null;
  message: string;
}

export interface CoreResponse {
  status?: boolean;
  statusCode?: number;
  data?: any;
  message?: string;
  excel?: {
    name: string;
    data: Record<any, any>[];
    customHeaders?: Array<string>;
  };
}
