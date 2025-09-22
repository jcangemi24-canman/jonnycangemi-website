import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development or if no admin exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      )
    }

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}