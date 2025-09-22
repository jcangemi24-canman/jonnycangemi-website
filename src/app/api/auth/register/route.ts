import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, hashedPassword, accessCode } = await request.json()

    // Validate access code
    if (!accessCode) {
      return NextResponse.json(
        { message: 'Access code is required' },
        { status: 400 }
      )
    }

    const validCode = await prisma.accessCode.findUnique({
      where: { code: accessCode }
    })

    if (!validCode || !validCode.isActive) {
      return NextResponse.json(
        { message: 'Invalid or inactive access code' },
        { status: 400 }
      )
    }

    if (validCode.expiresAt && new Date() > validCode.expiresAt) {
      return NextResponse.json(
        { message: 'Access code has expired' },
        { status: 400 }
      )
    }

    if (validCode.maxUses && validCode.usedCount >= validCode.maxUses) {
      return NextResponse.json(
        { message: 'Access code usage limit reached' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: 'guest', // Default role for access code users
      }
    })

    // Update access code usage count
    await prisma.accessCode.update({
      where: { id: validCode.id },
      data: { usedCount: validCode.usedCount + 1 }
    })

    // Record code usage
    await prisma.codeUsage.create({
      data: {
        accessCodeId: validCode.id,
        userId: user.id,
      }
    })

    // Log the registration attempt
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email,
        ip,
        userAgent,
        success: true,
      }
    })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}