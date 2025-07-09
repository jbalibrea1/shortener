export interface IShortURL {
  id: string;
  url: string;
  title?: string | null;
  logo?: string | null;
  description?: string | null;
  totalClicks: number;
  shortURL: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewShortURLEntry = Omit<
  IShortURL,
  'shortURL' | 'createdAt' | 'updatedAt' | 'id' | 'totalClicks'
>;
