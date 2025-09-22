import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all access codes (admin only)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const accessCodes = await prisma.accessCode.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(accessCodes)
  } catch (error) {
    console.error('Error fetching access codes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new access code (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { code, description, expiresAt, maxUses } = await request.json()

    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses || null,
        usedCount: 0,
        isActive: true,
        createdById: user.id,
      }
    })

    return NextResponse.json(accessCode, { status: 201 })
  } catch (error) {
    console.error('Error creating access code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}