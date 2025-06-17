import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    {
      name: 'Електроніка',
      description: 'Смартфони, планшети, ноутбуки та інша електроніка',
      imageUrl: '/categories/electronics.jpg'
    },
    {
      name: 'Одяг',
      description: 'Чоловічий та жіночий одяг, взуття, аксесуари',
      imageUrl: '/categories/clothing.jpg'
    },
    {
      name: 'Дім та сад',
      description: 'Меблі, декор, садовий інвентар та інструменти',
      imageUrl: '/categories/home-garden.jpg'
    },
    {
      name: 'Спорт і відпочинок',
      description: 'Спортивне обладнання, одяг для спорту, товари для відпочинку',
      imageUrl: '/categories/sports.jpg'
    },
    {
      name: 'Краса та здоров\'я',
      description: 'Косметика, парфумерія, товари для здоров\'я',
      imageUrl: '/categories/beauty.jpg'
    },
    {
      name: 'Дитячі товари',
      description: 'Іграшки, дитячий одяг, товари для немовлят',
      imageUrl: '/categories/kids.jpg'
    },
    {
      name: 'Автотовари',
      description: 'Запчастини, аксесуари та догляд за автомобілем',
      imageUrl: '/categories/auto.jpg'
    },
    {
      name: 'Книги та хобі',
      description: 'Книги, товари для творчості та хобі',
      imageUrl: '/categories/books.jpg'
    },
    {
      name: 'Продукти харчування',
      description: 'Продукти харчування та напої',
      imageUrl: '/categories/food.jpg'
    },
    {
      name: 'Побутова техніка',
      description: 'Техніка для дому та кухні',
      imageUrl: '/categories/appliances.jpg'
    }
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category
    })
  }

  console.log('Categories have been seeded! 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
