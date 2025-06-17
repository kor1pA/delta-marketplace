// @ts-check
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
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

    const categories = [
      {
        name: 'Електроніка',
        description: 'Смартфони, ноутбуки, планшети та інша електроніка',
        imageUrl: '/categories/electronics.jpg'
      },
      {
        name: 'Одяг',
        description: 'Чоловічий та жіночий одяг, взуття, аксесуари',
        imageUrl: '/categories/clothing.jpg'
      },
      {
        name: 'Дім та сад',
        description: 'Меблі, декор, садові інструменти та приладдя',
        imageUrl: '/categories/home-garden.jpg'
      },
      {
        name: 'Спорт та відпочинок',
        description: 'Спортивне обладнання, одяг для спорту, туристичне спорядження',
        imageUrl: '/categories/sports.jpg'
      },
      {
        name: 'Краса та здоров\'я',
        description: 'Косметика, парфумерія, товари для здоров\'я',
        imageUrl: '/categories/beauty-health.jpg'
      },
      {
        name: 'Дитячі товари',
        description: 'Іграшки, дитячий одяг, товари для немовлят',
        imageUrl: '/categories/kids.jpg'
      },
      {
        name: 'Книги та хобі',
        description: 'Книги, настільні ігри, товари для хобі та творчості',
        imageUrl: '/categories/books-hobbies.jpg'
      },
      {
        name: 'Автотовари',
        description: 'Автозапчастини, аксесуари для авто, автоелектроніка',
        imageUrl: '/categories/auto.jpg'
      },
      {
        name: 'Продукти харчування',
        description: 'Продукти харчування, напої, делікатеси',
        imageUrl: '/categories/food.jpg'
      },
      {
        name: 'Зоотовари',
        description: 'Корм та аксесуари для домашніх тварин',
        imageUrl: '/categories/pets.jpg'
      }
    ];

    console.log('Creating categories...');
    for (const category of categories) {
      const created = await prisma.category.create({ data: category });
      console.log(`Created category: ${created.name} with ID ${created.id}`);
    }

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
