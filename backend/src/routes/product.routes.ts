import express from 'express';
import { prisma } from '../index';
import { authorize } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  All authenticated users
 */
router.get('/', async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  All authenticated users
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        roomProducts: {
          include: {
            room: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Admin and Manager
 */
router.post('/', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { name, sku, unitType, unitValue, description } = req.body;

    // Validate input
    if (!name || !sku || !unitType || unitValue === undefined) {
      throw new BadRequestError('Name, SKU, unit type, and unit value are required');
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      throw new BadRequestError('SKU already exists');
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        unitType,
        unitValue,
        description,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Admin and Manager
 */
router.put('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    const { name, sku, unitType, unitValue, description } = req.body;

    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID');
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Check if SKU is already taken by another product
    if (sku && sku !== existingProduct.sku) {
      const productWithSameSku = await prisma.product.findUnique({
        where: { sku },
      });

      if (productWithSameSku) {
        throw new BadRequestError('SKU already exists');
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        sku,
        unitType,
        unitValue,
        description,
      },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Admin and Manager
 */
router.delete('/:id', authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID');
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Check if product is used in any count items
    const countItems = await prisma.countItem.findMany({
      where: { productId },
    });

    if (countItems.length > 0) {
      throw new BadRequestError('Cannot delete product that is used in count sessions');
    }

    // Delete room-product associations first
    await prisma.roomProduct.deleteMany({
      where: { productId },
    });

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;