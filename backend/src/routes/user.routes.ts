import express from 'express';
import { prisma } from '../index';
import { authorize, requireBasicAuth } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';
import bcrypt from 'bcrypt';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin only
 */
router.get('/', authorize(['admin']), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get('/:id', authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Admin only
 */
router.put('/:id', authorize(['admin']), requireBasicAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, password, role, active } = req.body;

    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check if username is already taken by another user
    if (username && username !== existingUser.username) {
      const userWithSameUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (userWithSameUsername) {
        throw new BadRequestError('Username already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (username) updateData.username = username;
    if (role) {
      if (!['admin', 'manager', 'user'].includes(role)) {
        throw new BadRequestError('Invalid role');
      }
      updateData.role = role;
    }
    if (active !== undefined) updateData.active = active;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/:id', authorize(['admin']), requireBasicAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Prevent deleting the last admin user
    if (existingUser.role === 'admin') {
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      if (adminCount <= 1) {
        throw new BadRequestError('Cannot delete the last admin user');
      }
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;