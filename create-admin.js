const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔄 Creating admin account...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      console.log('✅ Admin account already exists!')
      console.log(`Email: ${existingAdmin.email}`)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('i9METzozWgk2jkUBuea6nw==', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Jonny Cangemi',
        email: 'jcangemi24@gmail.com',
        hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    console.log('🎉 Admin account created successfully!')
    console.log('📧 Email: jcangemi24@gmail.com')
    console.log('🔑 Password: i9METzozWgk2jkUBuea6nw==')
    console.log('🔗 Sign in at: https://jonnycangemi.com/auth/signin')

  } catch (error) {
    console.error('❌ Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()