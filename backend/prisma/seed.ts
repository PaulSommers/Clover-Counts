import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.countItem.deleteMany();
  await prisma.countSession.deleteMany();
  await prisma.roomProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  
  // Create default admin user
  const adminPasswordHash = await bcrypt.hash('admin', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin',
      active: true,
    },
  });

  // Create default manager user
  const managerPasswordHash = await bcrypt.hash('manager', 10);
  const manager = await prisma.user.create({
    data: {
      username: 'manager',
      passwordHash: managerPasswordHash,
      role: 'manager',
      active: true,
    },
  });

  // Create default user
  const userPasswordHash = await bcrypt.hash('user', 10);
  const user = await prisma.user.create({
    data: {
      username: 'user',
      passwordHash: userPasswordHash,
      role: 'user',
      active: true,
    },
  });

  console.log('Creating rooms...');
  
  // Create sample rooms
  const kitchen = await prisma.room.create({
    data: {
      name: 'Kitchen',
      description: 'Main kitchen area',
    },
  });

  const bar = await prisma.room.create({
    data: {
      name: 'Bar',
      description: 'Bar and beverage area',
    },
  });

  const dryStorage = await prisma.room.create({
    data: {
      name: 'Dry Storage',
      description: 'Dry goods storage area',
    },
  });

  const freezer = await prisma.room.create({
    data: {
      name: 'Freezer',
      description: 'Main freezer',
    },
  });

  const refrigerator = await prisma.room.create({
    data: {
      name: 'Refrigerator',
      description: 'Main refrigerator',
    },
  });

  console.log('Creating products...');
  
  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Flour',
        sku: 'FL-001',
        unitType: 'weight',
        unitValue: 0.45,
        description: '5lb bag of all-purpose flour',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sugar',
        sku: 'SG-001',
        unitType: 'weight',
        unitValue: 0.65,
        description: '4lb bag of granulated sugar',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Butter',
        sku: 'BT-001',
        unitType: 'count',
        unitValue: 4.25,
        description: '1lb package of unsalted butter',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Eggs',
        sku: 'EG-001',
        unitType: 'count',
        unitValue: 0.25,
        description: 'Large eggs',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Milk',
        sku: 'MK-001',
        unitType: 'count',
        unitValue: 3.75,
        description: 'Gallon of whole milk',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chicken Breast',
        sku: 'CB-001',
        unitType: 'weight',
        unitValue: 2.99,
        description: 'Boneless, skinless chicken breast',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ground Beef',
        sku: 'GB-001',
        unitType: 'weight',
        unitValue: 4.50,
        description: '80/20 ground beef',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tomatoes',
        sku: 'TM-001',
        unitType: 'count',
        unitValue: 0.75,
        description: 'Roma tomatoes',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Onions',
        sku: 'ON-001',
        unitType: 'count',
        unitValue: 0.50,
        description: 'Yellow onions',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Potatoes',
        sku: 'PT-001',
        unitType: 'count',
        unitValue: 0.35,
        description: 'Russet potatoes',
      },
    }),
  ]);

  console.log('Mapping products to rooms...');
  
  // Map products to rooms
  await Promise.all([
    // Dry Storage
    prisma.roomProduct.create({
      data: {
        roomId: dryStorage.id,
        productId: products[0].id, // Flour
        displayOrder: 1,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: dryStorage.id,
        productId: products[1].id, // Sugar
        displayOrder: 2,
      },
    }),
    
    // Refrigerator
    prisma.roomProduct.create({
      data: {
        roomId: refrigerator.id,
        productId: products[2].id, // Butter
        displayOrder: 1,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: refrigerator.id,
        productId: products[3].id, // Eggs
        displayOrder: 2,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: refrigerator.id,
        productId: products[4].id, // Milk
        displayOrder: 3,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: refrigerator.id,
        productId: products[7].id, // Tomatoes
        displayOrder: 4,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: refrigerator.id,
        productId: products[8].id, // Onions
        displayOrder: 5,
      },
    }),
    
    // Freezer
    prisma.roomProduct.create({
      data: {
        roomId: freezer.id,
        productId: products[5].id, // Chicken Breast
        displayOrder: 1,
      },
    }),
    prisma.roomProduct.create({
      data: {
        roomId: freezer.id,
        productId: products[6].id, // Ground Beef
        displayOrder: 2,
      },
    }),
    
    // Kitchen
    prisma.roomProduct.create({
      data: {
        roomId: kitchen.id,
        productId: products[9].id, // Potatoes
        displayOrder: 1,
      },
    }),
  ]);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });