/**
 * Controlador de URLs acortadas. Gestiona la creación, consulta, redirección y eliminación de shortURLs.
 * Incluye endpoints para usuarios autenticados y anónimos.
 * @module controllers/shortURLController
 */

import { CustomJwtPayload, IJwtRequest } from '@/interfaces';
import shortURL from '@/services/shortURL.service';
import { successResponse } from '@/utils/succesResponse';
import token from '@/utils/token';
import { Request, Response } from 'express';
import path from 'path';

/**
 * Lista todas las URLs acortadas del usuario autenticado.
 * @route GET /api/urls
 * @param _req - Request de Express (no usado)
 * @param res - Response con el listado de URLs
 */
const listShortURLs = async (_req: IJwtRequest, res: Response) => {
  const user = _req.user as CustomJwtPayload | null;
  if (!user) {
    throw new Error('Unauthorized: No user authenticated');
  }
  const allUrls = await shortURL.getAllShortURLsFromUser(user);
  successResponse(res, 200, allUrls);
};

/**
 * Crea una nueva URL acortada. Si el usuario está autenticado, la asocia a su cuenta.
 * @route POST /api/urls
 * @param req - Request con { url } y, opcionalmente, usuario autenticado
 * @param res - Response con la URL acortada creada
 */
const createShortURL = async (
  req: Request<unknown, unknown, { url: string }>,
  res: Response
) => {
  const urlData = req.body;
  const user = token.extractToken(req) || undefined;
  const newShortUrlEntry = await shortURL.createShortURL(urlData, user);
  successResponse(res, 201, newShortUrlEntry);
};

/**
 * Devuelve información de una shortURL concreta.
 * @route GET /api/urls/:shortUrl
 * @param req - Request con el parámetro shortUrl
 * @param res - Response con la información de la shortURL
 */
const getShortURLInfo = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  const entry = await shortURL.getShortURLInfo(shortUrl);
  successResponse(res, 200, entry);
};

/**
 * Redirige a la URL original a partir de una shortURL, o muestra una página 404 si no existe.
 * @route GET /api/redirect/:shortUrl
 * @param req - Request con el parámetro shortUrl
 * @param res - Response con la redirección o la página 404
 */
const redirectShortURL = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  const url = await shortURL.resolveShortURL(shortUrl, req);
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
 * @param res - Response con mensaje de éxito
 */
const removeShortURL = async (req: IJwtRequest, res: Response) => {
  const { shortUrl } = req.params;
  const user = req.user as CustomJwtPayload | null;
  if (!user) {
    throw new Error('Unauthorized: No user authenticated');
  }
  await shortURL.deleteShortURL(shortUrl, user);
  successResponse(res, 204);
};

export default {
  listShortURLs,
  createShortURL,
  getShortURLInfo,
  redirectShortURL,
  removeShortURL
};
