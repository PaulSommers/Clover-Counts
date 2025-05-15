import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from './errorHandler';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

// Verify JWT token middleware
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return error
    if (!token) {
      return next(new AppError('Not authorized, no token provided', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      username: string;
      email: string;
      role: string;
    };

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Set user in request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return next(new AppError('Not authorized, invalid token', 401));
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized, no user found', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role (${req.user.role}) is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};