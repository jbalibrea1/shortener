import { NewShortURLEntry } from '../interfaces/shortURL.interface';

const parseUrl = (url: unknown): string => {
  if (!url || typeof url !== 'string') {
    throw new Error('Incorrect or missing url');
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  }

  return url;
};

const toNewShortUrlEntry = (urlObj: NewShortURLEntry): NewShortURLEntry => {
  if (!urlObj || typeof urlObj !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('url' in urlObj) {
    return {
      ...urlObj,
      url: parseUrl(urlObj.url),
    };
  }

  throw new Error('Incorrect data: a field missing');
};

export default toNewShortUrlEntry;
