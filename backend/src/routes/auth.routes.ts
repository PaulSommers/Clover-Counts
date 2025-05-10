import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { BadRequestError, UnauthorizedError } from '../middleware/errorHandler';
import { requireBasicAuth } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      throw new BadRequestError('Username and password are required');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.active) {
      throw new UnauthorizedError('User account is inactive');
    }

    // Check authentication mode
    const authMode = process.env.AUTH_MODE || 'basic';

    if (authMode === 'basic') {
      // Verify password
      if (!user.passwordHash) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
      }
    } else {
      // SSO mode - this would be handled differently
      throw new BadRequestError('SSO authentication is not implemented yet');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
    
    // Create payload
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    
    // Create options
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    };
    
    // Sign token
    const token = jwt.sign(payload, jwtSecret, options);

    // Return user info and token
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (only in basic auth mode)
 * @access  Admin only
 */
router.post('/register', requireBasicAuth, async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password) {
      throw new BadRequestError('Username and password are required');
    }

    if (!['admin', 'manager', 'user'].includes(role)) {
      throw new BadRequestError('Invalid role');
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestError('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
        active: true,
      },
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;