import { NewShortURLEntry } from "../interfaces/shortURL.interface";
import logger from "./logger";
import addMetadata from "./metadata";

const allowedSchemes = ["http", "https", "ftp"];

const parseUrl = (url: string): string => {
  if (!url || typeof url !== "string") {
    throw new Error("Incorrect or missing url");
  }

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("ftp://")
  ) {
    url = "http://" + url;
  }

  try {
    const parsedUrl = new URL(url);
    if (!allowedSchemes.includes(parsedUrl.protocol.replace(":", ""))) {
      throw new Error("URL has an invalid scheme");
    }

    const tldRegex = /\.[a-z]{2,}$/;
    if (!tldRegex.test(parsedUrl.hostname)) {
      throw new Error("URL must have a valid TLD");
    }

    return parsedUrl.href;
  } catch (error) {
    logger.error("Error parsing URL:", error);
    throw new Error("Invalid URL");
  }
};

const parsedURL = async (
  urlObj: NewShortURLEntry,
): Promise<NewShortURLEntry> => {
  if (!urlObj || typeof urlObj !== "object") {
    throw new Error("Incorrect or missing data");
  }
  urlObj = {
    ...urlObj,
    url: parseUrl(urlObj.url),
  };

  return await addMetadata(urlObj);
};

export default parsedURL;
