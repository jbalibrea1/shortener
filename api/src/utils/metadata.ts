import metascraper from 'metascraper';
import metascraperDescription from 'metascraper-description';
import metascraperLogoFavicon from 'metascraper-logo-favicon';
import metascraperTitle from 'metascraper-title';
import metascraperUrl from 'metascraper-url';
import { NewShortURLEntry } from '../interfaces/shortURL.interface';
import { fetchWithTimeout } from './fetchWithTimeout';

const scraper = metascraper([
  // metascraperImage(),
  metascraperTitle(),
  metascraperDescription(),
  metascraperUrl(),
  metascraperLogoFavicon()
]);

async function getMetadata(url: string) {
  const response = await fetchWithTimeout(url, 3, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'User-Agent':
        'Mozilla/5.0 (compatible; ShortenerBot/1.0; +https://yourdomain.com/bot)'
    }
  });

  const html = await response.text();
  const metadata = await scraper({ html, url });
  return metadata;
}

/**
 * Extracts and parses metadata from a given URL using Open Graph and HTML meta tags.
 * @param url - URL to extract metadata from
 * @returns Metadata object with title, description, image, etc.
 */
const addMetadata = async (
  entry: NewShortURLEntry
): Promise<NewShortURLEntry> => {
  try {
    const metadata = await getMetadata(entry.url);
    return {
      ...entry,
      title: metadata.title ?? null,
      logo: metadata.logo ?? null,
      description: metadata.description ?? null
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return entry;
  }
};

export default addMetadata;
