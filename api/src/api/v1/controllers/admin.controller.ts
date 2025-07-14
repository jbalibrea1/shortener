/**
 * Controlador para manejar las operaciones administrativas.
 * @module controllers/adminController
 */

import { Request, Response } from 'express';
import shortURLAdmin from '@/api/v1/services/shortURLAdmin.service';
import { successResponse } from '@/api/v1/utils/responses';
import { ValidationError } from '../utils/errors';

/**
 * Promueve un usuario a administrador.
 * @route POST /api/v1/admin/promote
 * @param req - Express Request con el body { username: string }
 * @param res - Express Response
 * @returns Respuesta con el userId y el nuevo rol
 * @throws ValidationError si falta username
 * @throws NotFoundError si el usuario no existe
 */
export const promoteAdmin = async (
  req: Request<unknown, unknown, { username: string }>,
  res: Response
) => {
  const { username } = req.body;
  if (!username) throw new ValidationError('Nombre de usuario requerido');
  const data = await shortURLAdmin.promoteUserToAdmin(username);
  successResponse({ res, data, msg: 'Usuario promovido a administrador' });
};

/**
 * Revoca el rol de administrador a un usuario.
 * @route POST /api/v1/admin/demote
 * @param req - Express Request con el body { username: string }
 * @param res - Express Response
 * @returns Respuesta con el username y el nuevo rol
 * @throws ValidationError si falta username
 * @throws NotFoundError si el usuario no existe
 */
export const demoteAdmin = async (
  req: Request<unknown, unknown, { username: string }>,
  res: Response
) => {
  const { username } = req.body;
  if (!username) throw new ValidationError('Nombre de usuario requerido');
  const data = await shortURLAdmin.demoteUserToAdmin(username);
  successResponse({ res, data, msg: 'Usuario removido de administrador' });
};

/**
 * Lista todas las URLs acortadas del sistema.
 * @route GET /api/v1/admin/urls
 * @param _req - Express Request vacío
 * @param res - Express Response
 * @returns Respuesta con todas las URLs acortadas
 */
export const listAllShortURLs = async (_req: Request, res: Response) => {
  const data = await shortURLAdmin.getAllShortURLs();
  successResponse({ res, data });
};
