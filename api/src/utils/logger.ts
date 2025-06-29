/**
 * Logger utility using console methods, can be replaced by Winston/Morgan in production.
 * Provides info and error logging with timestamps.
 * @module utils/logger
 */

/**
 * Imprime mensajes informativos en consola, excepto en entorno de test.
 * @param params - Mensajes a mostrar.
 */
const info = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

/**
 * Imprime mensajes de error en consola, excepto en entorno de test.
 * @param params - Mensajes a mostrar.
 */
const error = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

export default { error, info };
