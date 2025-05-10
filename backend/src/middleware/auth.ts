import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
      username: string;
      role: string;
    };
    
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user || !user.active) {
      throw new UnauthorizedError('User not found or inactive');
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check if user has required role
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role: ${roles.join(' or ')}`
        )
      );
    }
    
    next();
  };
};

/**
 * Middleware to check if authentication mode is basic
 */
export const requireBasicAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authMode = process.env.AUTH_MODE;
  
  if (authMode !== 'basic') {
    return next(
      new ForbiddenError(
        'This endpoint is only available in basic authentication mode'
      )
    );
  }
  
  next();
};