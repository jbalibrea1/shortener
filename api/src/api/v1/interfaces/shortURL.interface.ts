export interface IShortURL {
  id: string;
  url: string;
  title?: string | null;
  logo?: string | null;
  description?: string | null;
  totalClicks: number;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewShortURLEntry = Omit<
  IShortURL,
  'shortCode' | 'createdAt' | 'updatedAt' | 'id' | 'totalClicks'
>;
