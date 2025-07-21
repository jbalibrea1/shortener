/**
 * Middleware para validación de tipos y errores personalizados.
 * Incluye type guards para errores y objetos.
 * @module middleware/typeGuards
 */

const isErrorWithName = (e: unknown): e is { name: string } => {
  return (
    typeof e === 'object' &&
    e !== null &&
    'name' in e &&
    typeof (e as Record<string, unknown>).name === 'string'
  );
};

const isErrorWithMessage = (e: unknown): e is { message: string } => {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof (e as Record<string, unknown>).message === 'string'
  );
};

const isErrorWithStatus = (
  e: unknown,
): e is { status: number; message: string } => {
  return (
    typeof e === 'object' &&
    e !== null &&
    'status' in e &&
    typeof (e as Record<string, unknown>).status === 'number' &&
    'message' in e &&
    typeof (e as Record<string, unknown>).message === 'string'
  );
};

export { isErrorWithMessage, isErrorWithName, isErrorWithStatus };
