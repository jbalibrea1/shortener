import { Request, Response } from 'express';
import shortURL from '../services/shortURL.service';
import handleError from '../utils/handleError';
import token from '../utils/token';

const getAllShortURLs = async (_req: Request, res: Response) => {
  try {
    const allUrls = await shortURL.getAllSurl();
    res.json(allUrls);
  } catch (error) {
    handleError(res, 'Failed to get all short URLs.', error);
  }
};

interface IRequestURL extends Request {
  body: {
    url: string;
  };
}

const addShortURL = async (req: IRequestURL, res: Response) => {
  try {
    const { url } = req.body;
    const user = token.extractToken(req);
    console.log('User: ', user);
    const newShortUrlEntry = await shortURL.createSurl(url, user);
    res.json(newShortUrlEntry);
  } catch (error) {
    handleError(res, 'Failed to add short URL.', error);
  }
};

const getShortURL = async (req: Request, res: Response) => {
  try {
    const url = req.params.shortURL;
    const entry = await shortURL.getSurl(url);
    res.json(entry);
  } catch (error) {
    handleError(res, 'Failed to get full URL.', error);
  }
};

const getRedirect = async (req: Request, res: Response) => {
  try {
    const { shortURL: surl } = req.params;
    const entry = await shortURL.getSurl(surl);
    if (!entry.url) {
      throw new Error('No URL found for the given short URL');
    }
    // res.redirect(entry.url);
    res.json({ url: entry.url });
  } catch (error) {
    handleError(res, 'Failed to get full URL.', error);
  }
};

const deleteShortURL = async (req: Request, res: Response) => {
  try {
    const { surl } = req.params;
    const user = token.extractToken(req);
    await shortURL.deleteSurl(surl, user);
    res.status(200).json({ message: 'Short URL deleted successfully' });
  } catch (error) {
    handleError(res, 'Failed to delete short URL.', error);
  }
};

export default {
  getAllShortURLs,
  addShortURL,
  getShortURL,
  getRedirect,
  deleteShortURL,
};
