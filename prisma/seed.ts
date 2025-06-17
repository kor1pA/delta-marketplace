import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding process...');
  try {
    console.log('Deleting existing categories...');
    await prisma.category.deleteMany({});
    console.log('Successfully deleted existing categories');
  } catch (error) {
    console.error('Error deleting categories:', error);
    throw error;
  }

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
  ]
  console.log('Starting to create categories...');
  try {
    for (const category of categories) {
      console.log(`Creating category: ${category.name}`);
      await prisma.category.create({
        data: category
      });
      console.log(`Successfully created category: ${category.name}`);
    }
    console.log('All categories seeded successfully!');
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
