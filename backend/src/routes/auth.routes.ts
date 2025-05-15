import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'MANAGER', 'USER'])
      .withMessage('Role must be ADMIN, MANAGER, or USER'),
  ],
  validateRequest,
  authController.register
);

// Login user
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Get current user
router.get('/me', authController.getCurrentUser);

export default router;