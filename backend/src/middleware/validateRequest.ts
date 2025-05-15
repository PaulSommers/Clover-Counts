import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages: Record<string, string> = {};
    
    errors.array().forEach((error) => {
      if (error.type === 'field') {
        errorMessages[error.path] = error.msg;
      }
    });
    
    return next(new AppError('Validation error', 400));
  }
  
  next();
};