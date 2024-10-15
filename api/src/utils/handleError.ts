import { Response } from 'express';

const handleError = (res: Response, error: string, msg: unknown) => {
  let message: string = '';
  if (msg instanceof Error) {
    message = 'Error: ' + msg.message;
  }
  res.status(400).json({ error, message });
};

export default handleError;
