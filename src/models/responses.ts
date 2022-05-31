

export type APIResponse<T = any> = {
  error?: any,
  sql?: string,
  rowsPerPage?: number,
  totalRows?: number,
  errata?: any,
  data?: T[] | Partial<T>[],
};
