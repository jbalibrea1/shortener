import shortURLAdmin from '@/services/shortURLAdmin.service';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { successResponse } from '@/utils/succesResponse';
import { Request, Response } from 'express';
/**
 * TODO: Implementar las funciones de promoción y democión de administradores.
 * Controlador para manejar las operaciones administrativas.
 * @module controllers/adminController
 */

const promoteAdmin = async (
  req: Request<unknown, unknown, { userId: string }>,
  res: Response
) => {
  // Aquí iría la lógica para promover a un usuario a administrador
  // Por ejemplo, podrías buscar al usuario por ID y actualizar su rol
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequestError('ID de usuario requerido');
  }
  const result = await shortURLAdmin.promoteUserToAdmin(userId);
  if (!result) {
    throw new NotFoundError('Usuario no encontrado');
  }
  const data = {
    userId: result.userId,
    newRole: result.newRole
  };
  successResponse(res, 200, data, 'Usuario promovido a administrador');
};

const demoteAdmin = async (
  req: Request<unknown, unknown, { userId: string }>,
  res: Response
) => {
  // Aquí iría la lógica para demover a un administrador a usuario normal
  // Similar al anterior, buscar al usuario por ID y actualizar su rol
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequestError('ID de usuario requerido');
  }
  const result = await shortURLAdmin.demoteUserToAdmin(userId);
  if (!result) {
    throw new NotFoundError('Usuario no encontrado');
  }
  const data = {
    userId: result.userId,
    newRole: result.newRole
  };

  successResponse(res, 200, data, 'Usuario removido de administrador');
};

const listAllShortURLs = async (_req: Request, res: Response) => {
  const allUrls = await shortURLAdmin.getAllShortURLs();
  successResponse(res, 200, allUrls);
};

export default {
  listAllShortURLs,
  promoteAdmin,
  demoteAdmin
};
