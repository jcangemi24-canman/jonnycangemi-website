const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupProduction() {
  try {
    console.log('🔄 Setting up production database...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('i9METzozWgk2jkUBuea6nw==', 12)

    const admin = await prisma.user.upsert({
      where: { email: 'jcangemi24@gmail.com' },
      update: {},
      create: {
        name: 'Jonny Cangemi',
        email: 'jcangemi24@gmail.com',
        hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    console.log('✅ Admin account ready!')

    // Create a default access code
    const accessCode = await prisma.accessCode.upsert({
      where: { code: 'PORTFOLIO2024' },
      update: {},
      create: {
        code: 'PORTFOLIO2024',
        description: 'Default access code for portfolio guests',
        isActive: true,
        maxUses: 10,
        usedCount: 0,
        createdById: admin.id,
      }
    })

    console.log('✅ Default access code created!')
    console.log('🔑 Access Code: PORTFOLIO2024')
    console.log('👥 Max Uses: 10')

    console.log('\n🎉 Production setup complete!')
    console.log('📧 Admin Email: jcangemi24@gmail.com')
    console.log('🔑 Admin Password: i9METzozWgk2jkUBuea6nw==')
    console.log('🔗 Sign in: https://jonnycangemi.com/auth/signin')
    console.log('🎫 Guest Access Code: PORTFOLIO2024')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupProduction()