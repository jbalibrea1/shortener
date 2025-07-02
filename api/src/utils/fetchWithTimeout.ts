import { AppError } from './errors';
import logger from './logger';

export const fetchWithTimeout = async (
  url: string,
  retries = 3,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AppError(
          `HTTP error! status: ${response.status} on attempt ${attempt} for: ${url}`,
          response.status
        );
      }

      return response;
    } catch (error: unknown) {
      if ((error as Error)?.name === 'AbortError') {
        logger.warn(
          `[fetchWithTimeout] Timeout (AbortError) on attempt ${attempt} for: ${url}`
        );
      } else {
        logger.error(
          `[fetchWithTimeout] Error on attempt ${attempt} for: ${url} - ${
            (error as Error)?.message
          }`
        );
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new AppError('External API failed after retries', 502);
};
