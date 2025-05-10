import express from 'express';
import { prisma } from '../index';
import { authorize } from '../middleware/auth';
import { BadRequestError, NotFoundError, ForbiddenError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/count-sessions
 * @desc    Get all count sessions
 * @access  All authenticated users
 */
router.get('/', async (req, res, next) => {
  try {
    const { user } = req;
    
    // Filter sessions based on user role
    const sessions = await prisma.countSession.findMany({
      where: user?.role === 'user' ? {
        // Users can only see sessions they created or participated in
        OR: [
          { createdByUserId: user.id },
          {
            countItems: {
              some: {
                countedByUserId: user.id
              }
            }
          }
        ]
      } : undefined, // Admins and managers can see all sessions
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        _count: {
          select: {
            countItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/count-sessions/:id
 * @desc    Get count session by ID
 * @access  All authenticated users (with role-based filtering)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      throw new BadRequestError('Invalid session ID');
    }

    const session = await prisma.countSession.findUnique({
      where: { id: sessionId },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        countItems: {
          include: {
            product: true,
            room: true,
            countedBy: {
              select: {
                id: true,
                username: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      throw new NotFoundError('Count session not found');
    }

    // Check if user has access to this session
    if (user?.role === 'user' &&
        session.createdByUserId !== user.id &&
        !session.countItems.some((item: any) => item.countedByUserId === user.id)) {
      throw new ForbiddenError('You do not have access to this count session');
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/count-sessions
 * @desc    Create a new count session
 * @access  Admin and Manager
 */
router.post('/', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { name, rooms } = req.body;
    const { user } = req;

    // Validate input
    if (!name) {
      throw new BadRequestError('Session name is required');
    }

    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Create session
    const session = await prisma.countSession.create({
      data: {
        name,
        status: 'draft',
        createdByUserId: user.id
      }
    });

    // If rooms are specified, create count items for each product in each room
    if (rooms && Array.isArray(rooms) && rooms.length > 0) {
      for (const roomId of rooms) {
        const roomProducts = await prisma.roomProduct.findMany({
          where: { roomId: parseInt(roomId) },
          include: { product: true }
        });

        for (const roomProduct of roomProducts) {
          await prisma.countItem.create({
            data: {
              sessionId: session.id,
              productId: roomProduct.productId,
              roomId: roomProduct.roomId,
              quantity: 0,
              value: 0,
              countedByUserId: user.id,
              countedAt: new Date()
            }
          });
        }
      }
    }

    // Return the created session with count items
    const createdSession = await prisma.countSession.findUnique({
      where: { id: session.id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        countItems: {
          include: {
            product: true,
            room: true
          }
        }
      }
    });

    res.status(201).json(createdSession);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/count-sessions/:id
 * @desc    Update count session
 * @access  Admin and Manager
 */
router.put('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);
    const { name, status } = req.body;

    if (isNaN(sessionId)) {
      throw new BadRequestError('Invalid session ID');
    }

    // Check if session exists
    const existingSession = await prisma.countSession.findUnique({
      where: { id: sessionId }
    });

    if (!existingSession) {
      throw new NotFoundError('Count session not found');
    }

    // Validate status
    if (status && !['draft', 'in_progress', 'completed', 'finalized'].includes(status)) {
      throw new BadRequestError('Invalid status');
    }

    // Update session
    const session = await prisma.countSession.update({
      where: { id: sessionId },
      data: {
        name,
        status,
        ...(status === 'completed' || status === 'finalized' ? { endTime: new Date() } : {}),
        ...(status === 'in_progress' && !existingSession.startTime ? { startTime: new Date() } : {})
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/count-sessions/:id
 * @desc    Delete count session
 * @access  Admin and Manager
 */
router.delete('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      throw new BadRequestError('Invalid session ID');
    }

    // Check if session exists
    const existingSession = await prisma.countSession.findUnique({
      where: { id: sessionId }
    });

    if (!existingSession) {
      throw new NotFoundError('Count session not found');
    }

    // Don't allow deleting finalized sessions
    if (existingSession.status === 'finalized') {
      throw new BadRequestError('Cannot delete finalized count sessions');
    }

    // Delete count items first
    await prisma.countItem.deleteMany({
      where: { sessionId }
    });

    // Delete session
    await prisma.countSession.delete({
      where: { id: sessionId }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/count-sessions/:id/items
 * @desc    Add or update count items
 * @access  All authenticated users
 */
router.post('/:id/items', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);
    const { items } = req.body;
    const { user } = req;

    if (isNaN(sessionId)) {
      throw new BadRequestError('Invalid session ID');
    }

    if (!items || !Array.isArray(items)) {
      throw new BadRequestError('Items array is required');
    }

    // Check if session exists
    const session = await prisma.countSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      throw new NotFoundError('Count session not found');
    }

    // Don't allow updating finalized sessions
    if (session.status === 'finalized') {
      throw new BadRequestError('Cannot update finalized count sessions');
    }

    // Check if user has access to update this session
    if (user?.role === 'user' && session.createdByUserId !== user.id) {
      throw new ForbiddenError('You do not have permission to update this session');
    }

    // Process each item
    const updatedItems = [];
    for (const item of items) {
      const { id: itemId, productId, roomId, quantity } = item;
      
      if (itemId) {
        // Update existing item
        const existingItem = await prisma.countItem.findUnique({
          where: { id: parseInt(itemId) }
        });

        if (!existingItem || existingItem.sessionId !== sessionId) {
          throw new BadRequestError(`Invalid item ID: ${itemId}`);
        }

        const product = await prisma.product.findUnique({
          where: { id: existingItem.productId }
        });

        if (!product) {
          throw new BadRequestError(`Product not found for item: ${itemId}`);
        }

        const updatedItem = await prisma.countItem.update({
          where: { id: parseInt(itemId) },
          data: {
            quantity: parseFloat(quantity),
            value: parseFloat(quantity) * Number(product.unitValue),
            countedByUserId: user?.id || existingItem.countedByUserId,
            countedAt: new Date()
          },
          include: {
            product: true,
            room: true,
            countedBy: {
              select: {
                id: true,
                username: true,
                role: true
              }
            }
          }
        });

        updatedItems.push(updatedItem);
      } else if (productId && roomId) {
        // Create new item
        const product = await prisma.product.findUnique({
          where: { id: parseInt(productId) }
        });

        if (!product) {
          throw new BadRequestError(`Product not found: ${productId}`);
        }

        const room = await prisma.room.findUnique({
          where: { id: parseInt(roomId) }
        });

        if (!room) {
          throw new BadRequestError(`Room not found: ${roomId}`);
        }

        // Check if item already exists
        const existingItem = await prisma.countItem.findFirst({
          where: {
            sessionId,
            productId: parseInt(productId),
            roomId: parseInt(roomId)
          }
        });

        if (existingItem) {
          throw new BadRequestError(`Item already exists for this product and room`);
        }

        const newItem = await prisma.countItem.create({
          data: {
            sessionId,
            productId: parseInt(productId),
            roomId: parseInt(roomId),
            quantity: parseFloat(quantity),
            value: parseFloat(quantity) * Number(product.unitValue),
            countedByUserId: user?.id || session.createdByUserId,
            countedAt: new Date()
          },
          include: {
            product: true,
            room: true,
            countedBy: {
              select: {
                id: true,
                username: true,
                role: true
              }
            }
          }
        });

        updatedItems.push(newItem);
      } else {
        throw new BadRequestError('Each item must have either an ID or both productId and roomId');
      }
    }

    // If session is in draft status, update to in_progress
    if (session.status === 'draft') {
      await prisma.countSession.update({
        where: { id: sessionId },
        data: {
          status: 'in_progress',
          startTime: new Date()
        }
      });
    }

    res.json(updatedItems);
  } catch (error) {
    next(error);
  }
});

export default router;