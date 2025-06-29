import { Request } from 'express';

interface IRequestURL extends Request {
  body: {
    url: string;
  };
}

export default IRequestURL;
