// @ts-check
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Starting seeding process...');
  
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    console.log('Deleting existing categories...');
    await prisma.category.deleteMany();
    console.log('Successfully deleted existing categories');

    const testCategory = {
      name: 'Test Category',
      description: 'This is a test category',
      imageUrl: '/categories/test.jpg'
    };

    console.log('Creating test category...');
    const created = await prisma.category.create({
      data: testCategory
    });
    
    console.log(`Successfully created test category: ${created.name} with ID ${created.id}`);

    const count = await prisma.category.count();
    console.log(`Total categories in database: ${count}`);
    
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

main().catch((e) => {
  console.error('Fatal error during seeding:', e);
  process.exit(1);
});
