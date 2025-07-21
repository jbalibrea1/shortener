import type { Request } from 'express';

export interface IRequestURL extends Request {
  body: {
    url: string;
  };
}
