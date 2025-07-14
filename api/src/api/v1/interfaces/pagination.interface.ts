/**
 * Interface genérica para paginar cualquier tipo de datos
 *
 * @typeParam T - Tipo de datos que se están paginando
 */
export interface Pagination<T> {
  data: T[];
  pagination: {
    /** Total de elementos disponibles */
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
