/**
 * Controlador de URLs acortadas. Gestiona la creación, consulta, redirección y eliminación de shortURLs.
 * Incluye endpoints para usuarios autenticados y anónimos.
 * @module controllers/shortURLController
 */

import path from 'node:path';
import type { Request, Response } from 'express';
import type { CustomJwtPayload, IJwtRequest } from '@/api/v1/interfaces';
import shortURL from '@/api/v1/services/shortURL.service';
import { successResponse } from '@/api/v1/utils/responses';
import token from '@/api/v1/utils/token';

/**
 * Lista todas las URLs acortadas del usuario autenticado.
 * @route GET /api/urls
 * @param _req - Request de Express (no usado)
 * @param res - Response con el listado de URLs
 */
export const listShortURLs = async (_req: IJwtRequest, res: Response) => {
  const user = _req.user as CustomJwtPayload | null;
  if (!user) {
    throw new Error('Unauthorized: No user authenticated');
  }
  const allUrls = await shortURL.getAllShortURLsFromUser(user);
  successResponse({ res, data: allUrls });
};

/**
 * Crea una nueva URL acortada. Si el usuario está autenticado, la asocia a su cuenta.
 * @route POST /api/urls
 * @param req - Request con { url } y, opcionalmente, usuario autenticado
 * @param res - Response con la URL acortada creada
 */
export const createShortURL = async (
  req: Request<unknown, unknown, { url: string }>,
  res: Response,
) => {
  const urlData = req.body;
  const user = token.extractToken(req) || undefined;
  const newShortUrlEntry = await shortURL.createShortURL(urlData, user);
  successResponse({ res, status: 201, data: newShortUrlEntry });
};

/**
 * Devuelve información de una shortURL concreta.
 * @route GET /api/urls/:shortCode
 * @param req - Request con el parámetro shortCode
 * @param res - Response con la información de la shortURL
 */
export const getShortURLInfo = async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const entry = await shortURL.getShortURLInfo(shortCode);
  successResponse({ res, data: entry });
};

/**
 * Redirige a la URL original a partir de una shortURL, o muestra una página 404 si no existe.
 * @route GET /api/redirect/:shortCode
 * @param req - Request con el parámetro shortCode
 * @param res - Response con la redirección o la página 404
 */
export const redirectShortURL = async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const url = await shortURL.resolveShortURL(shortCode, req);
  if (!url) {
    return res
      .status(404)
      .sendFile(path.resolve(__dirname, '../static/notfound.html'));
  }
  res.redirect(url);
};

/**
 * Elimina una shortURL del usuario autenticado.
 * @route DELETE /api/urls/:shortUrl
 * @param req - Request con el parámetro shortUrl y usuario autenticado
 * @param res - 204 No Content si se elimina correctamente
 */
export const removeShortURL = async (req: IJwtRequest, res: Response) => {
  const { shortCode } = req.params;
  const user = req.user as CustomJwtPayload | null;
  if (!user) {
    throw new Error('Unauthorized: No user authenticated');
  }
  await shortURL.deleteShortURL(shortCode, user);
  res.status(204).end();
};
