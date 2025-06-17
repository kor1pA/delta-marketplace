import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log('Starting seeding process...')
  
  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connected successfully')

    console.log('Deleting existing categories...')
    await prisma.category.deleteMany({})
    console.log('Successfully deleted existing categories')

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
      }
    ]

    console.log('Starting to create categories...')
    for (const category of categories) {
      console.log(`Creating category: ${category.name}`)
      const created = await prisma.category.create({
        data: category
      })
      console.log(`Successfully created category: ${created.name} with ID ${created.id}`)
    }

    const count = await prisma.category.count()
    console.log(`Total categories in database: ${count}`)
    
    console.log('All categories seeded successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => {
  console.error('Fatal error during seeding:', e)
  process.exit(1)
})
