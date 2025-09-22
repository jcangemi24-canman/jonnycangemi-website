import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Create admin user if doesn't exist
    const hashedPassword = await bcrypt.hash('i9METzozWgk2jkUBuea6nw==', 12)

    const admin = await prisma.user.upsert({
      where: { email: 'jcangemi24@gmail.com' },
      update: {
        hashedPassword, // Update password in case it's different
        role: 'admin',
      },
      create: {
        name: 'Jonny Cangemi',
        email: 'jcangemi24@gmail.com',
        hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    // Create default access code
    await prisma.accessCode.upsert({
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

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      admin: {
        email: admin.email,
        role: admin.role,
      }
    })
  } catch (error) {
    console.error('Init DB error:', error)
    return NextResponse.json(
      { success: false, message: 'Database initialization failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}