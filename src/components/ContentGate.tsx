'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

interface ContentGateProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  requiredRole?: 'admin' | 'guest' | 'user'
  publicContent?: ReactNode
}

export default function ContentGate({
  children,
  fallback,
  requireAuth = true,
  requiredRole,
  publicContent
}: ContentGateProps) {
  const { data: session, status } = useSession()

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !session) {
    if (publicContent) {
      return <>{publicContent}</>
    }

    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-blue-600 mb-2">🔒</div>
        <h3 className="font-semibold text-blue-900 mb-2">Protected Content</h3>
        <p className="text-blue-700 text-sm mb-4">
          Sign in to view exclusive portfolio content and project details.
        </p>
        <a
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Sign In to View
        </a>
      </div>
    )
  }

  // Check role requirements
  if (requiredRole && session?.user) {
    // Get user role from database or session
    // For now, we'll assume admin role is stored in session
    const userRole = (session.user as any).role || 'user'

    if (requiredRole === 'admin' && userRole !== 'admin') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-600 mb-1">⚠️</div>
          <p className="text-red-700 text-sm">Admin access required</p>
        </div>
      )
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>
}