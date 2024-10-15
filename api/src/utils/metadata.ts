import metascraper from 'metascraper';
import metascraperDescription from 'metascraper-description';
import metascraperLogoFavicon from 'metascraper-logo-favicon';
import metascraperTitle from 'metascraper-title';
import metascraperUrl from 'metascraper-url';
import { NewShortURLEntry } from '../interfaces/shortURL.interface';
import truncateString from './truncateString';

const scraper = metascraper([
  // metascraperImage(),
  metascraperTitle(),
  metascraperDescription(),
  metascraperUrl(),
  metascraperLogoFavicon(),
]);

async function getMetadata(url: string) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
  const html = await response.text();
  const metadata = await scraper({ html, url });
  return metadata;
}

const addMetadata = async (
  entry: NewShortURLEntry
): Promise<NewShortURLEntry> => {
  try {
    const metadata = await getMetadata(entry.url);
    return {
      ...entry,
      title: metadata.title ?? null,
      logo: metadata.logo ?? null,
      description: metadata.description
        ? truncateString(metadata.description, 50)
        : null,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return entry;
  }
};

export default addMetadata;
