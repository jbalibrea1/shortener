/**
 * Controlador de URLs acortadas. Gestiona la creación, consulta, redirección y eliminación de shortURLs.
 * Incluye endpoints para usuarios autenticados y anónimos.
 * @module controllers/shortURLController
 */

import IRequestURL from '@/interfaces/requestURL.interface';
import shortURL from '@/services/shortURL.service';
import token from '@/utils/token';
import { Request, Response } from 'express';

/**
 * Devuelve todas las URLs acortadas.
 * @route GET /api/shorturl
 * @param _req - Request de Express (no usado)
 * @param res - Response de Express con el listado de URLs
 */
const getAllShortURLs = async (_req: Request, res: Response) => {
  const allUrls = await shortURL.getAllShortURLs();
  res.json(allUrls);
};

/**
 * Crea una nueva URL acortada.
 * Si el usuario está autenticado, la URL se asocia a su cuenta.
 * Si no, la URL se crea de forma anónima.
 * @route POST /api/shorturl
 * @param req - Request con { url } y, opcionalmente, usuario autenticado
 * @param res - Response con la URL acortada creada
 */
const addShortURL = async (req: IRequestURL, res: Response) => {
  const { url } = req.body;
  const user = token.extractToken(req);
  const newShortUrlEntry = await shortURL.createShortURL(url, user);
  res.json(newShortUrlEntry);
};

/**
 * Devuelve información de una shortURL concreta.
 * @route GET /api/shorturl/:surl
 * @param req - Request con el parámetro surl
 * @param res - Response con la información de la shortURL
 */
const getShortURL = async (req: Request, res: Response) => {
  const url = req.params.surl;
  const entry = await shortURL.getShortURLInfo(url);
  res.json(entry);
};

/**
 * Redirige (o devuelve) la URL original a partir de una shortURL.
 * @route GET /api/redirect/:shortURL
 * @param req - Request con el parámetro shortURL
 * @param res - Response con la URL original
 */
const getRedirect = async (req: Request, res: Response) => {
  const { shortURL: surl } = req.params;
  const url = await shortURL.resolveShortURL(surl);
  if (!url) {
    throw new Error('No URL found for the given short URL');
  }
  // res.redirect(url);
  res.json({ url });
};

/**
 * Elimina una shortURL del usuario autenticado.
 * @route DELETE /api/shorturl/:surl
 * @param req - Request con el parámetro surl y usuario autenticado
 * @param res - Response con mensaje de éxito
 */
const deleteShortURL = async (req: Request, res: Response) => {
  const { surl } = req.params;
  const user = token.extractToken(req);
  await shortURL.deleteShortURL(surl, user);
  res.status(200).json({ message: 'Short URL deleted successfully' });
};

export default {
  getAllShortURLs,
  addShortURL,
  getShortURL,
  getRedirect,
  deleteShortURL
};
