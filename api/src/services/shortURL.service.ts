import { CustomJwtPayload } from "../interfaces/customJwt.interface";
import { ShortURL } from "../interfaces/shortURL.interface";
import ShortURLModel from "../models/shortURL.model";
import UserModel from "../models/user.model";
import generateRandom from "../utils/generateRandom";
import parsedURL from "../utils/parsedURL";

const getAllSurl = async () => {
  const allUrls: ShortURL[] = await ShortURLModel.find({});
  return allUrls;
};

const createSurl = async (url: string, user: CustomJwtPayload | null) => {
  // validate and add metadata
  const newShortUrlEntry = await parsedURL({ url });

  // generate unique short URL until it is unique
  let uniqueShortURL = generateRandom();
  while (await ShortURLModel.findOne({ shortURL: uniqueShortURL })) {
    uniqueShortURL = generateRandom();
  }

  // create a new entry with the user id if user is logged
  const newEntry = new ShortURLModel({
    ...newShortUrlEntry,
    shortURL: uniqueShortURL,
    user: user?.id ?? null,
  });

  const savedEntry = await newEntry.save();

  if (user?.id) {
    await UserModel.findByIdAndUpdate(user.id, {
      $push: { shortURLs: savedEntry._id },
    });
  }

  return savedEntry;
};

const getInfoSurl = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });

  if (!entry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }
  const fullUser = await UserModel.findById(entry.user);

  return { entry, user: fullUser?.user ?? null };
};

const getSurl = async (shortURL: string) => {
  const entry = await ShortURLModel.findOne({ shortURL });

  if (!entry) {
    throw new Error(`Short URL not found for ${shortURL}`);
  }

  entry.totalClicks += 1;
  await entry.save();
  return entry.url;
};

const deleteSurl = async (shortURL: string, user: CustomJwtPayload | null) => {
  if (!user) {
    throw new Error("No authorization token provided");
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

export default { getAllSurl, createSurl, getSurl, deleteSurl, getInfoSurl };
