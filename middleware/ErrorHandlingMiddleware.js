import { AppError } from '../error/AppError.js';

export const errorHnadller = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'unknown error' });
};
