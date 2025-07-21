/**
 * Middleware para manejo de rutas desconocidas.
 * Devuelve un error 404 si la ruta no existe.
 * @module middleware/unknownEndpoint
 */

import type { Request, Response } from 'express';

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
