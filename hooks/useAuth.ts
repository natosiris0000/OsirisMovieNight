'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, type AuthUser } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('auth-changed', refresh)
    return () => window.removeEventListener('auth-changed', refresh)
  }, [refresh])

  return { user, loading, isAuthenticated: user !== null }
}
