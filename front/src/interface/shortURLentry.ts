export interface ShortUrlEntry {
  id: string;
  url: string;
  title?: string | null;
  description?: string | null;
  logo?: string | null;
  totalClicks: number;
  shortURL: string;
  createdAt: Date;
}
