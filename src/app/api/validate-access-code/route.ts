import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Access code is required' }, { status: 400 })
    }

    const accessCode = await prisma.accessCode.findUnique({
      where: { code }
    })

    if (!accessCode) {
      return NextResponse.json({ valid: false, message: 'Invalid access code' }, { status: 400 })
    }

    if (!accessCode.isActive) {
      return NextResponse.json({ valid: false, message: 'Access code is disabled' }, { status: 400 })
    }

    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
      return NextResponse.json({ valid: false, message: 'Access code has expired' }, { status: 400 })
    }

    if (accessCode.maxUses && accessCode.usedCount >= accessCode.maxUses) {
      return NextResponse.json({ valid: false, message: 'Access code usage limit reached' }, { status: 400 })
    }

    return NextResponse.json({ valid: true, message: 'Access code is valid' })
  } catch (error) {
    console.error('Error validating access code:', error)
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 })
  }
}