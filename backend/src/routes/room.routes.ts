import express from 'express';
import { prisma } from '../index';
import { authorize } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms
 * @access  All authenticated users
 */
router.get('/', async (_req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/rooms/:id
 * @desc    Get room by ID
 * @access  All authenticated users
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      throw new BadRequestError('Invalid room ID');
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        roomProducts: {
          include: {
            product: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Admin and Manager
 */
router.post('/', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      throw new BadRequestError('Room name is required');
    }

    // Create room
    const room = await prisma.room.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update room
 * @access  Admin and Manager
 */
router.put('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    const { name, description } = req.body;

    if (isNaN(roomId)) {
      throw new BadRequestError('Invalid room ID');
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    // Update room
    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        name,
        description,
      },
    });

    res.json(room);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete room
 * @access  Admin and Manager
 */
router.delete('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      throw new BadRequestError('Invalid room ID');
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    // Check if room is used in any count items
    const countItems = await prisma.countItem.findMany({
      where: { roomId },
    });

    if (countItems.length > 0) {
      throw new BadRequestError('Cannot delete room that is used in count sessions');
    }

    // Delete room-product associations first
    await prisma.roomProduct.deleteMany({
      where: { roomId },
    });

    // Delete room
    await prisma.room.delete({
      where: { id: roomId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/rooms/:roomId/products
 * @desc    Add product to room
 * @access  Admin and Manager
 */
router.post('/:roomId/products', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const roomIdNum = parseInt(roomId);
    const { productId, displayOrder } = req.body;
    const productIdNum = parseInt(productId);

    if (isNaN(roomIdNum) || isNaN(productIdNum)) {
      throw new BadRequestError('Invalid room ID or product ID');
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: roomIdNum },
    });

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productIdNum },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if product is already in room
    const existingRoomProduct = await prisma.roomProduct.findFirst({
      where: {
        roomId: roomIdNum,
        productId: productIdNum,
      },
    });

    if (existingRoomProduct) {
      throw new BadRequestError('Product is already in this room');
    }

    // Get the highest display order in the room
    const highestOrder = await prisma.roomProduct.findFirst({
      where: { roomId: roomIdNum },
      orderBy: { displayOrder: 'desc' },
    });

    const newDisplayOrder = displayOrder || (highestOrder ? highestOrder.displayOrder + 1 : 1);

    // Add product to room
    const roomProduct = await prisma.roomProduct.create({
      data: {
        roomId: roomIdNum,
        productId: productIdNum,
        displayOrder: newDisplayOrder,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(roomProduct);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/rooms/:roomId/products/:productId
 * @desc    Remove product from room
 * @access  Admin and Manager
 */
router.delete('/:roomId/products/:productId', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { roomId, productId } = req.params;
    const roomIdNum = parseInt(roomId);
    const productIdNum = parseInt(productId);

    if (isNaN(roomIdNum) || isNaN(productIdNum)) {
      throw new BadRequestError('Invalid room ID or product ID');
    }

    // Check if room-product association exists
    const roomProduct = await prisma.roomProduct.findFirst({
      where: {
        roomId: roomIdNum,
        productId: productIdNum,
      },
    });

    if (!roomProduct) {
      throw new NotFoundError('Product is not in this room');
    }

    // Remove product from room
    await prisma.roomProduct.delete({
      where: { id: roomProduct.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;