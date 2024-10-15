import { CustomJwtPayload } from '../interfaces/customJwt.interface';
import { ShortURL } from '../interfaces/shortURL.interface';
import ShortURLModel from '../models/shortURL.model';
import UserModel from '../models/user.model';
import addMetadata from '../utils/metadata';
import generateUniqueShortUrl from '../utils/randomUrl';
import toNewShortUrlEntry from '../utils/shortEntry';

const getAllSurl = async () => {
  const allUrls: ShortURL[] = await ShortURLModel.find({});
  return allUrls;
};

const createSurl = async (url: string, user: CustomJwtPayload | null) => {
  let newShortUrlEntry = toNewShortUrlEntry({ url });

  // add metadata to the entry
  newShortUrlEntry = await addMetadata(newShortUrlEntry);

  // generate a unique short url while not clashing with existing ones
  let shortURL = generateUniqueShortUrl();
  while (await ShortURLModel.findOne({ shortURL })) {
    shortURL = generateUniqueShortUrl();
  }

  // create a new entry
  const newEntry = new ShortURLModel({
    ...newShortUrlEntry,
    shortURL,
    user: user?.id ?? null,
  });
  const savedEntry = await newEntry.save();

  if (user?.id) {
    console.log("Adding short URL to user's list of URLs");
    await UserModel.findByIdAndUpdate(user.id, {
      $push: { shortURLs: savedEntry._id },
    });
  }

  return savedEntry;
};

const getSurl = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });

  if (!entry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }

  entry.totalClicks += 1;
  await entry.save();
  return entry;
};

const deleteSurl = async (shortURL: string, user: CustomJwtPayload | null) => {
  if (!user) {
    throw new Error('No authorization token provided');
  }

  const deletedEntry = await ShortURLModel.findOneAndDelete({
    shortURL,
    user: user.id,
  });

  if (!deletedEntry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }

  await UserModel.findByIdAndUpdate(user.id, {
    $pull: { shortURLs: deletedEntry._id },
  });

  return deletedEntry;
};

export default { getAllSurl, createSurl, getSurl, deleteSurl };
